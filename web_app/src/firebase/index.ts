import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";
import { FIREBASE_CONFIG } from "../config";

let initialized = false;

export function initFirebase() {
  if (!initialized) {
    firebase.initializeApp(FIREBASE_CONFIG);
    initialized = true;
  }
}
