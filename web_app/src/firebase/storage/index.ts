import * as firebase from "firebase/app";
import "firebase/firestore";

import { initFirebase } from "..";

export enum Collections {
  HelpRequests = "help_requests"
}

export function getFirestore() {
  initFirebase();
  return firebase.firestore();
}
