import * as firebase from "firebase/app";
import "firebase/firestore";

import { initFirebase } from "..";

export enum Collections {
  HelpRequests = "help_requests",
  Threads = "threads",
  Messages = "messages"
}

export enum CreateResultStatus {
  CREATED = "CREATED",
  AUTHENTICATI0N_REQUIRED = "AUTHENTICATION_REQUIRED",
  ERROR = "ERROR"
}

export type CreateResult<ResultType> =
  | {
      status: CreateResultStatus.CREATED;
      result: ResultType;
      error: undefined;
    }
  | {
      status: CreateResultStatus.AUTHENTICATI0N_REQUIRED;
      result: undefined;
      error: undefined;
    }
  | {
      status: CreateResultStatus.ERROR;
      result: undefined;
      error: string;
    };

export function getFirestore() {
  initFirebase();
  return firebase.firestore();
}
