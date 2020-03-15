import * as firebase from "firebase/app";
import "firebase/firestore";

import {
  getFirestore,
  Collections,
  CreateResult,
  CreateResultStatus,
  UpdateResult,
  UpdateResultStatus
} from ".";
import { getAuth } from "../auth";

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
}

/**
 * Maps Firestore HelpRequest query snapshot to the local HelpRequest type.
 */
function mapQueryDocToHelpRequest(
  doc: firebase.firestore.DocumentSnapshot
): HelpRequest {
  const id = doc.id;
  const {
    created_at,
    updated_at,
    creator_id,
    title,
    body,
    status
  } = doc.data() as HelpRequestDocument;
  return {
    id,
    createdAt: created_at ? created_at.toDate() : new Date(),
    updatedAt: updated_at ? updated_at.toDate() : new Date(),
    creatorId: creator_id,
    title,
    body,
    status
  };
}

export async function createHelpRequest({
  title,
  body
}: Omit<
  HelpRequest,
  "id" | "createdAt" | "updatedAt" | "status" | "creatorId"
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
    location: new firebase.firestore.GeoPoint(0, 0)
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

export async function getHelpRequests(): Promise<HelpRequest[]> {
  const querySnapshot = await getFirestore()
    .collection(Collections.HelpRequests)
    .get();
  return querySnapshot.docs.map(mapQueryDocToHelpRequest);
}
