import * as firebase from "firebase/app";
import "firebase/firestore";
import geohash from "ngeohash";

import {
  getFirestore,
  Collections,
  CreateResult,
  CreateResultStatus,
  UpdateResult,
  UpdateResultStatus
} from ".";
import { getAuth } from "../auth";
import {
  Location,
  getDistanceFromLatLngInKm
} from "../../components/helpers/location";

export enum HelpRequestStatus {
  ACTIVE = "ACTIVE",
  CLAIMED = "CLAIMED",
  RESOLVED = "RESOLVED"
}

/**
 * The shape of a HelpRequest in Firestore.
 */
interface HelpRequestDocument {
  created_at: firebase.firestore.Timestamp | null;
  updated_at: firebase.firestore.Timestamp | null;

  creator_id: string;
  title: string;
  body: string;
  status: HelpRequestStatus;
  location: firebase.firestore.GeoPoint;
  // See https://levelup.gitconnected.com/nearby-location-queries-with-cloud-firestore-e7f4a2f18f9d
  geohash: string;
}

/**
 * The shape of a HelpRequest that the client app uses.
 *
 * (Just a bit easier for us to use than raw Firestore docs.)
 */
export interface HelpRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  creatorId: string;
  title: string;
  body: string;
  status: HelpRequestStatus;
  location: Location;
  geohash: string;
  // If a location filter is applied, then this will have the distance of the
  // HelpRequest from that location.
  distance?: number;
}

/**
 * Maps Firestore HelpRequest query snapshot to the local HelpRequest type.
 */
function mapQueryDocToHelpRequest(
  doc: firebase.firestore.DocumentSnapshot,
  locationForDistance?: Location
): HelpRequest {
  const id = doc.id;
  const {
    created_at,
    updated_at,
    creator_id,
    title,
    body,
    status,
    location: firebaseLocation,
    geohash
  } = doc.data() as HelpRequestDocument;
  const location: Location = {
    lat: firebaseLocation.latitude,
    lng: firebaseLocation.longitude
  };
  return {
    id,
    createdAt: created_at ? created_at.toDate() : new Date(),
    updatedAt: updated_at ? updated_at.toDate() : new Date(),
    creatorId: creator_id,
    title,
    body,
    status,
    location,
    geohash,
    distance: locationForDistance
      ? getDistanceFromLatLngInKm(locationForDistance, location)
      : undefined
  };
}

export async function createHelpRequest({
  title,
  body,
  location
}: Omit<
  HelpRequest,
  "id" | "createdAt" | "updatedAt" | "status" | "creatorId" | "geohash"
>): Promise<CreateResult<HelpRequest>> {
  const currentUser = getAuth().currentUser;

  if (!currentUser) {
    return {
      status: CreateResultStatus.AUTHENTICATI0N_REQUIRED,
      result: undefined,
      error: undefined
    };
  }

  const newDoc: Omit<HelpRequestDocument, "id"> = {
    created_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    updated_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    creator_id: currentUser.uid,
    title,
    body,
    status: HelpRequestStatus.ACTIVE,
    location: new firebase.firestore.GeoPoint(location.lat, location.lng),
    geohash: geohash.encode(location.lat, location.lng)
  };

  return {
    status: CreateResultStatus.CREATED,
    result: mapQueryDocToHelpRequest(
      await (
        await getFirestore()
          .collection(Collections.HelpRequests)
          .add(newDoc)
      ).get()
    ),
    error: undefined
  };
}

export async function updateHelpRequestStatus({
  id,
  status
}: {
  id: string;
  status: HelpRequestStatus;
}): Promise<UpdateResult<HelpRequest>> {
  if (!getAuth().currentUser) {
    return {
      status: UpdateResultStatus.AUTHENTICATI0N_REQUIRED,
      result: undefined,
      error: undefined
    };
  }

  await getFirestore()
    .collection(Collections.HelpRequests)
    .doc(id)
    .update({ status });

  return {
    status: UpdateResultStatus.UPDATED,
    result: mapQueryDocToHelpRequest(
      await getFirestore()
        .collection(Collections.HelpRequests)
        .doc(id)
        .get()
    ),
    error: undefined
  };
}

export async function getHelpRequest({
  id
}: {
  id: string;
}): Promise<HelpRequest | undefined> {
  const helpRequestDoc = await getFirestore()
    .collection(Collections.HelpRequests)
    .doc(id)
    .get();
  return helpRequestDoc.exists
    ? mapQueryDocToHelpRequest(helpRequestDoc)
    : undefined;
}

/**
 * Calculate the upper and lower boundary geohashes for a given latitude,
 * longitude, and distance in miles.
 *
 * @param latitude
 * @param longitude
 * @param distance in kilometers
 */
const getGeohashRange = (
  latitude: number,
  longitude: number,
  distance: number
) => {
  const lat = 0.009009009009; // approximate degrees latitude per kilometer
  const lon = 0.01176470588; // approximate degrees longitude per kilometer at 40degrees

  const lowerLat = latitude - lat * distance;
  const lowerLon = longitude - lon * distance;

  const upperLat = latitude + lat * distance;
  const upperLon = longitude + lon * distance;

  const lower = geohash.encode(lowerLat, lowerLon);
  const upper = geohash.encode(upperLat, upperLon);

  return {
    lower,
    upper
  };
};

interface LocationFilter {
  location: Location;
  distance: number; // in kilometers
}

export interface HelpRequestFilters {
  locationFilter?: LocationFilter;
}

export async function getHelpRequests({
  filters
}: {
  filters?: HelpRequestFilters;
}): Promise<HelpRequest[]> {
  let query:
    | firebase.firestore.CollectionReference
    | firebase.firestore.Query = getFirestore().collection(
    Collections.HelpRequests
  );

  console.log(filters);

  if (filters) {
    const { locationFilter } = filters;
    if (locationFilter) {
      const { location, distance } = locationFilter;
      const { upper, lower } = getGeohashRange(
        location.lat,
        location.lng,
        distance
      );
      console.log("upper", upper, "lower", lower);
      query = query
        .orderBy("geohash", "desc")
        .where("geohash", ">=", lower)
        .where("geohash", "<=", upper);
    }
  }

  query = query.orderBy("created_at", "desc");

  const querySnapshot = await query.get();
  return querySnapshot.docs.map(doc =>
    mapQueryDocToHelpRequest(doc, filters?.locationFilter?.location)
  );
}
