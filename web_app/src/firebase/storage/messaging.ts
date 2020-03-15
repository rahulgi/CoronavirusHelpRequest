import * as firebase from "firebase/app";

import { getAuth } from "../auth";
import { getFirestore, Collections } from ".";

/**
 * The shape of a Thread in Firestore.
 */
interface ThreadDocument {
  created_at: firebase.firestore.Timestamp | null;
  updated_at: firebase.firestore.Timestamp | null;

  help_request_id: string;
  creator_id: string;
  participant_ids: string[];

  last_message_at: firebase.firestore.Timestamp | null;
}

/**
 * The shape of a Thread that the client app uses.
 */
export interface Thread {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  helpRequestId: string;
  creatorId: string;
  participantIds: string[];

  lastMessageAt: Date;
}

function mapQueryDocToThread(doc: firebase.firestore.DocumentSnapshot): Thread {
  const id = doc.id;
  const {
    created_at,
    updated_at,
    help_request_id,
    creator_id,
    participant_ids,
    last_message_at
  } = doc.data() as ThreadDocument;
  return {
    id,
    createdAt: created_at ? created_at.toDate() : new Date(),
    updatedAt: updated_at ? updated_at.toDate() : new Date(),
    helpRequestId: help_request_id,
    creatorId: creator_id,
    participantIds: participant_ids,
    lastMessageAt: last_message_at ? last_message_at.toDate() : new Date()
  };
}

/**
 * The shape of a Message in Firestore.
 */
interface MessageDocument {
  created_at: firebase.firestore.Timestamp | null;
  updated_at: firebase.firestore.Timestamp | null;

  thread_id: string;
  creator_id: string;

  message: string;
}

/**
 * The shape of a Message that the client app uses.
 */
export interface Message {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  threadId: string;
  creatorId: string;

  message: string;
}

function mapQueryDocToMessage(
  doc: firebase.firestore.DocumentSnapshot
): Message {
  const id = doc.id;
  const {
    created_at,
    updated_at,
    thread_id,
    creator_id,
    message
  } = doc.data() as MessageDocument;
  return {
    id,
    createdAt: created_at ? created_at.toDate() : new Date(),
    updatedAt: updated_at ? updated_at.toDate() : new Date(),
    threadId: thread_id,
    creatorId: creator_id,
    message
  };
}

export async function getThreads({
  forUserId
}: {
  forUserId: string;
}): Promise<Thread[]> {
  return (
    await getFirestore()
      .collection(Collections.Threads)
      .where("participant_ids", "array-contains", forUserId)
      .get()
  ).docs.map(mapQueryDocToThread);
}

export async function getThread({
  forUserId,
  forHelpRequestId
}: {
  forUserId: string;
  forHelpRequestId: string;
}): Promise<Thread | undefined> {
  const results = await getFirestore()
    .collection(Collections.Threads)
    .where("help_request_id", "==", forHelpRequestId)
    .where("participant_ids", "array-contains", forUserId)
    .get();

  // There shouldn't ever be more than one thread for this combination. Even if
  // there is, we return the first one.
  return results.empty ? undefined : mapQueryDocToThread(results.docs[0]);
}

type UnsubscribeListenerFunction = () => void;

/**
 * Returns an unsubscribe function that should be called when the component
 * that is listening unmounts.
 */
export function listenForMessages({
  threadId,
  setMessages,
  setMessagesError
}: {
  threadId: string;
  setMessages: (messages: Message[]) => void;
  setMessagesError: (e: Error) => void;
}): UnsubscribeListenerFunction {
  const currentUserId = getAuth().currentUser?.uid;

  if (!currentUserId) {
    throw new Error("Must be logged in to listen for messages!");
  }

  return getFirestore()
    .collection(Collections.Messages)
    .where("thread_id", "==", threadId)
    .onSnapshot(
      snapshot => setMessages(snapshot.docs.map(mapQueryDocToMessage)),
      error => setMessagesError(error)
    );
}

export async function createMessage({
  threadId,
  message
}: Omit<Message, "id" | "createdAt" | "updatedAt" | "creatorId">) {
  const currentUser = getAuth().currentUser;

  if (!currentUser) {
    throw new Error("There is no logged in user!");
  }

  const newDoc: Omit<MessageDocument, "id"> = {
    created_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    updated_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    creator_id: currentUser.uid,
    thread_id: threadId,
    message
  };

  await getFirestore()
    .collection(Collections.Threads)
    .doc(threadId)
    .update({
      last_message_at: firebase.firestore.FieldValue.serverTimestamp()
    });

  return (
    await getFirestore()
      .collection(Collections.Messages)
      .add(newDoc)
  ).id;
}

export async function createThread({
  helpRequestId,
  participantIds
}: Omit<
  Thread,
  "id" | "createdAt" | "updatedAt" | "creatorId" | "lastMessageAt"
>) {
  const currentUser = getAuth().currentUser;

  if (!currentUser) {
    throw new Error("There is no logged in user!");
  }

  const newDoc: Omit<ThreadDocument, "id"> = {
    created_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    updated_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    creator_id: currentUser.uid,
    help_request_id: helpRequestId,
    participant_ids: participantIds,
    last_message_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp
  };

  return (
    await getFirestore()
      .collection(Collections.Threads)
      .add(newDoc)
  ).id;
}
