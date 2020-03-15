import * as firebase from "firebase/app";
import "firebase/firestore";

import { initFirebase } from ".";
import { HelpRequest } from "../components/common/HelpRequestCard";

export enum Collections {
  HelpRequests = "help_requests"
}

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

  title: string;
  body: string;
  status: HelpRequestStatus;
  location: firebase.firestore.GeoPoint;
}

/**
 * Maps Firestore HelpRequest query snapshot to the local HelpRequest type.
 */
export function mapQueryDocToHelpRequest(
  doc: firebase.firestore.DocumentSnapshot
): HelpRequest {
  const id = doc.id;
  const {
    created_at,
    updated_at,
    title,
    body,
    status
  } = doc.data() as HelpRequestDocument;
  return {
    id,
    createdAt: created_at ? created_at.toDate() : new Date(),
    updatedAt: updated_at ? updated_at.toDate() : new Date(),
    title,
    body,
    status
  };
}

export async function createHelpRequest({
  title,
  body
}: Omit<HelpRequest, "id" | "createdAt" | "updatedAt" | "status">): Promise<
  string
> {
  const newDoc: Omit<HelpRequestDocument, "id"> = {
    created_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    updated_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    title,
    body,
    status: HelpRequestStatus.ACTIVE,
    location: new firebase.firestore.GeoPoint(0, 0)
  };

  return (
    await getFirestore()
      .collection(Collections.HelpRequests)
      .add(newDoc)
  ).id;
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

export function getFirestore() {
  initFirebase();
  return firebase.firestore();
}
