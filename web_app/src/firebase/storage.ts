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
  created_at: firebase.firestore.Timestamp;
  updated_at: firebase.firestore.Timestamp;

  title: string;
  body: string;
  status: HelpRequestStatus;
}

/**
 * Maps Firestore HelpRequest query snapshot to the local HelpRequest type.
 */
export function mapQueryDocToHelpRequest(
  doc: firebase.firestore.QueryDocumentSnapshot
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
    createdAt: created_at.toDate(),
    updatedAt: updated_at.toDate(),
    title,
    body,
    status
  };
}

export function getFirestore() {
  initFirebase();
  return firebase.firestore();
}
