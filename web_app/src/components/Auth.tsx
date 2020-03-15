import React, { useEffect, useState } from "react";
import * as firebase from "firebase/app";
import * as firebaseui from "firebaseui";

import { getAuth } from "../firebase/auth";

import "firebaseui/dist/firebaseui.css";
import { Redirect } from "react-router-dom";
import {
  updateAuthState,
  useAuthStatus,
  AuthStatus
} from "./contexts/AuthContext";

// No redirect URL has been found. You must either specify a signInSuccessUrl in
// the configuration, pass in a redirect URL to the widget URL, or return false
// from the callback. Dismiss

/**
 * Validate that the url we're redirecting to belongs to our app. Otherwise
 * users could create a malicious link that redirects the user to a page of
 * their choice after they authenticate.
 */
function validateRedirect(redirect: string) {
  return redirect.startsWith("/") ? redirect : "/";
}

const ui = new firebaseui.auth.AuthUI(getAuth());
const FIREBASE_UI_CONTAINER_ID = "firebase-container";

export const Auth: React.FC<{ redirectTo?: string }> = ({ redirectTo }) => {
  const authStatus = useAuthStatus();
  const [success, setSuccess] = useState(false);
  // TODO handle displaying error.
  const [error, setError] = useState<string>();

  /**
   * See sample config at: https://github.com/firebase/firebaseui-web/blob/master/README.md
   */
  function getUiConfig(): firebaseui.auth.Config {
    return {
      signInSuccessUrl: "/requestHelp", //redirectTo ? validateRedirect(redirectTo) : "/",
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          // We will handle redirection
          updateAuthState(authResult.user);
          setSuccess(true);
          return false;
        },
        signInFailure: async function(error) {
          setError("An error occurred trying to sign in. Please try again.");
          return;
        }
      },
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

  useEffect(() => {
    ui.start(`#${FIREBASE_UI_CONTAINER_ID}`, getUiConfig());
  }, []);

  if (authStatus === AuthStatus.LOGGED_IN || success) {
    const redirect = redirectTo ? validateRedirect(redirectTo) : "/";
    return <Redirect to={redirect} push />;
  }

  return (
    <div>
      <div id={FIREBASE_UI_CONTAINER_ID} />
    </div>
  );
};
