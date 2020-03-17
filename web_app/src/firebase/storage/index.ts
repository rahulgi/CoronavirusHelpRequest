import * as firebase from "firebase/app";
import "firebase/firestore";

import { initFirebase } from "..";

export enum Collections {
  HelpRequests = "help_requests",
  HelpOffers = "help_offers",
  Threads = "threads",
  Messages = "messages",
  Users = "users"
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

export enum UpdateResultStatus {
  UPDATED = "UPDATED",
  AUTHENTICATI0N_REQUIRED = "AUTHENTICATION_REQUIRED",
  ERROR = "ERROR"
}

export type UpdateResult<ResultType> =
  | {
      status: UpdateResultStatus.UPDATED;
      result: ResultType;
      error: undefined;
    }
  | {
      status: UpdateResultStatus.AUTHENTICATI0N_REQUIRED;
      result: undefined;
      error: undefined;
    }
  | {
      status: UpdateResultStatus.ERROR;
      result: undefined;
      error: string;
    };

export function getFirestore() {
  initFirebase();
  return firebase.firestore();
}
