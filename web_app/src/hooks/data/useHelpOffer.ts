import { useState, useCallback } from "react";

import {
  HelpOffer,
  getHelpOfferForCurrentUser,
  getHelpOffer
} from "../../firebase/storage/helpOffer";
import { useAsyncEffect } from "../useAsyncEffect";
import { FetchResultStatus, FetchResult } from ".";
import {
  useAuthStatus,
  AuthStatus
} from "../../components/contexts/AuthContext";

export type HelpOfferResult = FetchResult<HelpOffer>;

export function useHelpOfferForCurrentUser(): HelpOfferResult {
  const authStatus = useAuthStatus();
  const [helpOfferResult, setHelpOfferResult] = useState<HelpOfferResult>({
    status: FetchResultStatus.LOADING,
    result: undefined,
    error: undefined
  });

  const fetchHelpOffer = useCallback(async (): Promise<HelpOfferResult> => {
    if (authStatus === AuthStatus.LOGGED_OUT) {
      return {
        status: FetchResultStatus.AUTHENTICATION_REQUIRED,
        result: undefined,
        error: undefined
      };
    }

    const helpOffer = await getHelpOfferForCurrentUser();
    return helpOffer
      ? {
          status: FetchResultStatus.FOUND,
          result: helpOffer,
          error: undefined
        }
      : {
          status: FetchResultStatus.NOT_FOUND,
          result: undefined,
          error: undefined
        };
  }, [authStatus]);
  const handleHelpOffer = useCallback(setHelpOfferResult, []);
  const handleHelpOfferError = useCallback((e: Error) => {
    console.error(e);
    setHelpOfferResult({
      status: FetchResultStatus.ERROR,
      result: undefined,
      error: "An error occurred while getting data for this Help Offer."
    });
  }, []);

  useAsyncEffect({
    asyncOperation: fetchHelpOffer,
    handleResponse: handleHelpOffer,
    handleError: handleHelpOfferError
  });

  return helpOfferResult;
}

export function useHelpOffer(id: string): HelpOfferResult {
  const [helpOfferResult, setHelpOfferResult] = useState<HelpOfferResult>({
    status: FetchResultStatus.LOADING,
    result: undefined,
    error: undefined
  });

  const fetchHelpOffer = useCallback(async (): Promise<HelpOfferResult> => {
    const helpOffer = await getHelpOffer(id);
    return helpOffer
      ? {
          status: FetchResultStatus.FOUND,
          result: helpOffer,
          error: undefined
        }
      : {
          status: FetchResultStatus.NOT_FOUND,
          result: undefined,
          error: undefined
        };
  }, []);
  const handleHelpOffer = useCallback(setHelpOfferResult, []);
  const handleHelpOfferError = useCallback((e: Error) => {
    console.error(e);
    setHelpOfferResult({
      status: FetchResultStatus.ERROR,
      result: undefined,
      error: "An error occurred while getting data for this Help Offer."
    });
  }, []);

  useAsyncEffect({
    asyncOperation: fetchHelpOffer,
    handleResponse: handleHelpOffer,
    handleError: handleHelpOfferError
  });

  return helpOfferResult;
}
