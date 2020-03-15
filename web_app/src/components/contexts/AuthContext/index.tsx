import React, { useState, useContext } from "react";
import * as firebase from "firebase/app";

import { getAuth } from "../../../firebase/auth";

const auth = getAuth();

export enum AuthStatus {
  LOGGED_OUT = "LOGGED_OUT",
  LOGGED_IN = "LOGGED_IN"
}

type AuthState =
  | {
      status: AuthStatus.LOGGED_IN;
      user: firebase.User;
    }
  | {
      status: AuthStatus.LOGGED_OUT;
      user: undefined;
    };

const INITIAL_AUTH_STATE: AuthState = {
  status: AuthStatus.LOGGED_OUT,
  user: undefined
};

let setAuthState: React.Dispatch<AuthState>;

export function logoutAuthState() {
  if (setAuthState) {
    setAuthState({
      user: undefined,
      status: AuthStatus.LOGGED_OUT
    });
  }
}

export function updateAuthState(user: firebase.User | null) {
  if (setAuthState) {
    if (user) {
      return setAuthState({ user, status: AuthStatus.LOGGED_IN });
    }
    return logoutAuthState();
  }
}

auth.onAuthStateChanged(updateAuthState);

export const AuthContext = React.createContext<AuthState>(INITIAL_AUTH_STATE);

export const AuthProvider: React.FC<{}> = ({ children }) => {
  const [authState, authStateSetter] = useState<AuthState>(INITIAL_AUTH_STATE);
  setAuthState = authStateSetter;

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export function useLoggedIn(): AuthStatus {
  return useContext(AuthContext).status;
}
