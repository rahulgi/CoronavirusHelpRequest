import { useState, useCallback } from "react";

import { FetchResult, FetchResultStatus } from ".";
import {
  HelpRequest,
  HelpRequestFilters,
  getHelpRequests
} from "../../firebase/storage/helpRequest";
import { useAsyncEffect } from "../useAsyncEffect";
import { useCurrentUserId } from "../../components/contexts/AuthContext";

export type HelpRequestsResult = FetchResult<HelpRequest[]>;

export function useHelpRequests(
  filters?: HelpRequestFilters
): HelpRequestsResult {
  const [helpRequestsResult, setHelpRequestsResult] = useState<
    HelpRequestsResult
  >({
    status: FetchResultStatus.LOADING,
    result: undefined,
    error: undefined
  });

  const fetchHelpRequests = useCallback(async (): Promise<
    HelpRequestsResult
  > => {
    setHelpRequestsResult({
      status: FetchResultStatus.LOADING,
      result: undefined,
      error: undefined
    });
    return {
      status: FetchResultStatus.FOUND,
      result: await getHelpRequests({ filters }),
      error: undefined
    };
  }, [filters]);
  const handleHelpRequests = useCallback(setHelpRequestsResult, []);
  const handleHelpRequestsError = useCallback((e: Error) => {
    console.error(e);
    setHelpRequestsResult({
      status: FetchResultStatus.ERROR,
      result: undefined,
      error: "An error occurred while fetching Help Requests."
    });
  }, []);

  useAsyncEffect({
    asyncOperation: fetchHelpRequests,
    handleResponse: handleHelpRequests,
    handleError: handleHelpRequestsError
  });

  return helpRequestsResult;
}

export function useHelpRequestsForCurrentUser(): HelpRequestsResult {
  const currentUserId = useCurrentUserId();

  const [helpRequestsResult, setHelpRequestsResult] = useState<
    HelpRequestsResult
  >({
    status: FetchResultStatus.LOADING,
    result: undefined,
    error: undefined
  });

  const fetchHelpRequests = useCallback(async (): Promise<
    HelpRequestsResult
  > => {
    if (!currentUserId) {
      return {
        status: FetchResultStatus.AUTHENTICATION_REQUIRED,
        result: undefined,
        error: undefined
      };
    }

    setHelpRequestsResult({
      status: FetchResultStatus.LOADING,
      result: undefined,
      error: undefined
    });
    return {
      status: FetchResultStatus.FOUND,
      result: await getHelpRequests({
        filters: { creatorFilter: { creatorId: currentUserId as string } }
      }),
      error: undefined
    };
  }, [currentUserId]);
  const handleHelpRequests = useCallback(setHelpRequestsResult, []);
  const handleHelpRequestsError = useCallback((e: Error) => {
    console.error(e);
    setHelpRequestsResult({
      status: FetchResultStatus.ERROR,
      result: undefined,
      error: "An error occurred while fetching Help Requests."
    });
  }, []);

  useAsyncEffect({
    asyncOperation: fetchHelpRequests,
    handleResponse: handleHelpRequests,
    handleError: handleHelpRequestsError
  });

  return helpRequestsResult;
}
