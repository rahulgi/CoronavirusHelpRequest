import React, { useState, useContext } from "react";
import * as firebase from "firebase/app";

import { getAuth } from "../../../firebase/auth";
import { User, getUser, createUser } from "../../../firebase/storage/user";
import { CreateResultStatus } from "../../../firebase/storage";

const auth = getAuth();

export enum AuthStatus {
  LOGGED_OUT = "LOGGED_OUT",
  LOGGED_IN = "LOGGED_IN"
}

type AuthState =
  | {
      status: AuthStatus.LOGGED_IN;
      user: User;
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

function getDisplayName(user: firebase.User): string | undefined {
  if (user.displayName) {
    return user.displayName;
  }
  for (const providerData of user.providerData) {
    if (providerData?.displayName) {
      return providerData.displayName;
    }
  }
  return undefined;
}

function getProfilePicture(user: firebase.User) {
  if (user.photoURL) {
    return user.photoURL;
  }
  for (const providerData of user.providerData) {
    if (providerData?.photoURL) {
      return providerData.photoURL;
    }
  }
  return undefined;
}

export async function updateAuthState(firebaseUser: firebase.User | null) {
  if (setAuthState) {
    if (firebaseUser) {
      const user = await getUser(firebaseUser.uid);
      if (user) {
        return setAuthState({
          user,
          status: AuthStatus.LOGGED_IN
        });
      }
      const createUserResult = await createUser({
        id: firebaseUser.uid,

        displayName: getDisplayName(firebaseUser),
        profileUrl: getProfilePicture(firebaseUser)
      });

      if (createUserResult.status === CreateResultStatus.CREATED) {
        return setAuthState({
          user: createUserResult.result,
          status: AuthStatus.LOGGED_IN
        });
      }
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

export function useAuthStatus(): AuthStatus {
  return useContext(AuthContext).status;
}

export function useCurrentUserId(): string | undefined {
  return useContext(AuthContext).user?.id;
}
