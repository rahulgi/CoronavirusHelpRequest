import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

let initialized = false;

// Retrieved from the Firebase Console -> Settings -> General -> Config
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCDQkDeYC3TXbJtG4lM6okHS-zN3xHps5E",
  authDomain: "coronavirushelprequest-2f3f9.firebaseapp.com",
  databaseURL: "https://coronavirushelprequest-2f3f9.firebaseio.com",
  projectId: "coronavirushelprequest-2f3f9",
  storageBucket: "coronavirushelprequest-2f3f9.appspot.com",
  messagingSenderId: "561662606033",
  appId: "1:561662606033:web:4b4d7cc98fe61f4d84e3f0",
  measurementId: "G-PV7WY3V78S"
};

export function initFirebase() {
  if (!initialized) {
    firebase.initializeApp(FIREBASE_CONFIG);
    initialized = true;
  }
}
