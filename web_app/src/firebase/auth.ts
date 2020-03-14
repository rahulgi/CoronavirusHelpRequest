import * as firebase from "firebase/app";
import "firebase/auth";

import { initFirebase } from ".";

export function getAuth() {
  initFirebase();
  return firebase.auth();
}
