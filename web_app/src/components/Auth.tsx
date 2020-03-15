import React, { useEffect } from "react";
import * as firebase from "firebase/app";
import * as firebaseui from "firebaseui";

import { getAuth } from "../firebase/auth";

import "firebaseui/dist/firebaseui.css";

// No redirect URL has been found. You must either specify a signInSuccessUrl in
// the configuration, pass in a redirect URL to the widget URL, or return false
// from the callback. Dismiss

function getUiConfig(): firebaseui.auth.Config {
  return {
    //   signInFlow: "redirect",
    signInSuccessUrl: "/",
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
}

const ui = new firebaseui.auth.AuthUI(getAuth());
const FIREBASE_UI_CONTAINER_ID = "firebase-container";

export const Auth: React.FC = () => {
  useEffect(() => {
    ui.start(`#${FIREBASE_UI_CONTAINER_ID}`, getUiConfig());
  });

  return (
    <div>
      <div id={FIREBASE_UI_CONTAINER_ID} />
    </div>
  );
};
