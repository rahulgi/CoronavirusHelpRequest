import * as firebase from "firebase/app";
import { getFirestore, Collections, CreateResult, CreateResultStatus } from ".";

/**
 * The shape of a User in Firestore.
 */
interface UserDocument {
  created_at: firebase.firestore.Timestamp | null;
  updated_at: firebase.firestore.Timestamp | null;

  // uid - the Firebase Auth User object's uid is this object's id.

  display_name: string | undefined;
  profile_url: string | undefined;
}

/**
 * The shape of a User that the client uses.
 */
export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  displayName: string | undefined;
  profileUrl: string | undefined;
}

function mapQueryDocToUser(doc: firebase.firestore.DocumentSnapshot): User {
  const id = doc.id;
  const {
    created_at,
    updated_at,
    display_name,
    profile_url
  } = doc.data() as UserDocument;
  return {
    id,
    createdAt: created_at ? created_at.toDate() : new Date(),
    updatedAt: updated_at ? updated_at.toDate() : new Date(),
    displayName: display_name,
    profileUrl: profile_url
  };
}

export async function getUser(id: string): Promise<User | undefined> {
  const user = await getFirestore()
    .collection(Collections.Users)
    .doc(id)
    .get();

  return user.exists ? mapQueryDocToUser(user) : undefined;
}

export async function createUser({
  id,
  displayName,
  profileUrl
}: Omit<User, "createdAt" | "updatedAt">): Promise<CreateResult<User>> {
  const newDoc: UserDocument = {
    created_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    updated_at: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    display_name: displayName,
    profile_url: profileUrl
  };

  await getFirestore()
    .collection(Collections.Users)
    .doc(id)
    .set(newDoc);

  const getResult = await getFirestore()
    .collection(Collections.Users)
    .doc(id)
    .get();

  console.log(getResult);

  return {
    status: CreateResultStatus.CREATED,
    result: mapQueryDocToUser(getResult),
    error: undefined
  };
}
