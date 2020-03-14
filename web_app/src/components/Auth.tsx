import React, { useEffect } from "react";
import * as firebase from "firebase/app";
import * as firebaseui from "firebaseui";

import { getAuth } from "../firebase/auth";

import "firebaseui/dist/firebaseui.css";

const UI_CONFIG: firebaseui.auth.Config = {
  //   signInSuccessUrl: "/",
  //   signInFlow: "redirect",
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true,
      signInMethod:
        firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
    },
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      authMethod: "https://accounts.google.com"
    }
  ]
};

const ui = new firebaseui.auth.AuthUI(getAuth());
const FIREBASE_UI_CONTAINER_ID = "firebase-container";

export const Auth: React.FC = () => {
  useEffect(() => {
    ui.start(`#${FIREBASE_UI_CONTAINER_ID}`, UI_CONFIG);
  });

  return (
    <div>
      <div id={FIREBASE_UI_CONTAINER_ID} />
    </div>
  );
};
