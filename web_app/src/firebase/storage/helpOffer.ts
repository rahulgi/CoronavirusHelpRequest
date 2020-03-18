import * as firebase from "firebase/app";
import "firebase/firestore";
import geohash from "ngeohash";

import {
  getFirestore,
  Collections,
  CreateResult,
  CreateResultStatus,
  UpdateResult,
  UpdateResultStatus,
  QUERY_SIZE_LIMIT
} from ".";
import { getAuth } from "../auth";
import {
  Location,
  getDistanceFromLatLngInKm,
  getGeohashRange
} from "../../components/helpers/location";

/**
 * The shape of a HelpOffer in Firestore.
 */
interface HelpOfferDocument {
  created_at: firebase.firestore.Timestamp | null;
  updated_at: firebase.firestore.Timestamp | null;

  creator_id: string;

  location: firebase.firestore.GeoPoint;
  location_name: string;
  // See https://levelup.gitconnected.com/nearby-location-queries-with-cloud-firestore-e7f4a2f18f9d
  geohash: string;
  radius: number; // km

  title: string;
  body: string;
}

/**
 * The shape of a HelpOffer that the client app uses.
 *
 * (Just a bit easier for us to use than raw Firestore docs.)
 */
export interface HelpOffer {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  collection: Collections.HelpOffers;

  creatorId: string;

  location: Location;
  locationName: string;
  geohash: string;
  radius: number;
  // If a location filter is applied, then this will have the distance of the
  // HelpOffer from that location.
  distance?: number;

  title: string;
  body: string;
}

/**
 * Maps Firestore HelpOffer query snapshot to the local HelpOffer type.
 */
function mapQueryDocToHelpOffer(
  doc: firebase.firestore.DocumentSnapshot,
  locationForDistance?: Location
): HelpOffer {
  const id = doc.id;
  const {
    created_at,
    updated_at,
    creator_id,

    location: firebaseLocation,
    location_name,
    geohash,
    radius,
    title,
    body
  } = doc.data() as HelpOfferDocument;
  const location: Location = {
    lat: firebaseLocation.latitude,
    lng: firebaseLocation.longitude
  };
  return {
    id,
    createdAt: created_at ? created_at.toDate() : new Date(),
    updatedAt: updated_at ? updated_at.toDate() : new Date(),
    creatorId: creator_id,

    collection: Collections.HelpOffers,

    location,
    locationName: location_name,
    geohash,
    radius,
    distance: locationForDistance
      ? getDistanceFromLatLngInKm(locationForDistance, location)
      : undefined,
    title,
    body
  };
}

export async function createHelpOffer({
  location,
  locationName,
  radius,
  title,
  body
}: Omit<
  HelpOffer,
  "id" | "createdAt" | "updatedAt" | "creatorId" | "geohash" | "collection"
>): Promise<CreateResult<HelpOffer>> {
  const currentUser = getAuth().currentUser;

  if (!currentUser) {
    return {
      status: CreateResultStatus.AUTHENTICATI0N_REQUIRED,
      result: undefined,
      error: undefined
    };
  }

  const newDoc: Omit<HelpOfferDocument, "id"> = {
    created_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    updated_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    creator_id: currentUser.uid,
    location: new firebase.firestore.GeoPoint(location.lat, location.lng),
    location_name: locationName,
    geohash: geohash.encode(location.lat, location.lng),
    radius,
    title,
    body
  };

  return {
    status: CreateResultStatus.CREATED,
    result: mapQueryDocToHelpOffer(
      await (
        await getFirestore()
          .collection(Collections.HelpOffers)
          .add(newDoc)
      ).get()
    ),
    error: undefined
  };
}

export async function getHelpOfferForCurrentUser(): Promise<
  HelpOffer | undefined
> {
  const currentUser = getAuth().currentUser;

  if (!currentUser) {
    throw new Error("User must be authenticated to get their own help offer.");
  }

  const helpOfferDoc = await getFirestore()
    .collection(Collections.HelpOffers)
    .where("creator_id", "==", currentUser.uid)
    .get();

  if (helpOfferDoc.empty) {
    return undefined;
  }

  // Always return the first one if multiple match
  return mapQueryDocToHelpOffer(helpOfferDoc.docs[0]);
}

export async function getHelpOffer(id: string): Promise<HelpOffer | undefined> {
  const helpOfferDoc = await getFirestore()
    .collection(Collections.HelpOffers)
    .doc(id)
    .get();

  return helpOfferDoc.exists ? mapQueryDocToHelpOffer(helpOfferDoc) : undefined;
}

export async function updateHelpOffer({
  id,
  location,
  locationName,
  radius,
  title,
  body
}: Omit<
  HelpOffer,
  "createdAt" | "updatedAt" | "creatorId" | "geohash" | "collection"
>): Promise<UpdateResult<HelpOffer>> {
  if (!getAuth().currentUser) {
    return {
      status: UpdateResultStatus.AUTHENTICATI0N_REQUIRED,
      result: undefined,
      error: undefined
    };
  }

  await getFirestore()
    .collection(Collections.HelpOffers)
    .doc(id)
    .update({
      updated_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
      location: new firebase.firestore.GeoPoint(location.lat, location.lng),
      location_name: locationName,
      geohash: geohash.encode(location.lat, location.lng),
      radius,
      title,
      body
    });

  return {
    status: UpdateResultStatus.UPDATED,
    result: mapQueryDocToHelpOffer(
      await getFirestore()
        .collection(Collections.HelpOffers)
        .doc(id)
        .get()
    ),
    error: undefined
  };
}

interface LocationFilter {
  location: Location;
  distance: number; // in kilometers
}

export interface HelpOfferFilters {
  locationFilter?: LocationFilter;
}

export async function getHelpOffers({
  filters
}: {
  filters?: HelpOfferFilters;
}): Promise<HelpOffer[]> {
  let query:
    | firebase.firestore.CollectionReference
    | firebase.firestore.Query = getFirestore().collection(
    Collections.HelpOffers
  );

  if (filters) {
    const { locationFilter } = filters;
    if (locationFilter) {
      const { location, distance } = locationFilter;
      const { upper, lower } = getGeohashRange(
        location.lat,
        location.lng,
        distance
      );
      query = query
        .orderBy("geohash", "desc")
        .where("geohash", ">=", lower)
        .where("geohash", "<=", upper);
    }
  }

  query = query.orderBy("created_at", "desc").limit(QUERY_SIZE_LIMIT);

  const querySnapshot = await query.get();
  return querySnapshot.docs.map(doc =>
    mapQueryDocToHelpOffer(doc, filters?.locationFilter?.location)
  );
}
