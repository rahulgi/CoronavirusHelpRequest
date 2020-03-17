import { useState, useCallback } from "react";

import { FetchResult, FetchResultStatus } from ".";
import { Thread, getThreads } from "../../firebase/storage/messaging";
import { useCurrentUserId } from "../../components/contexts/AuthContext";
import { useAsyncEffect } from "../useAsyncEffect";

export type ThreadsResult = FetchResult<Thread[]>;

export function useThreads(helpRequestId?: string) {
  const currentUserId = useCurrentUserId();
  const [threadsResult, setThreadsResult] = useState<ThreadsResult>({
    status: FetchResultStatus.LOADING,
    result: undefined,
    error: undefined
  });

  const fetchThreads = useCallback(async (): Promise<ThreadsResult> => {
    if (!currentUserId) {
      return {
        status: FetchResultStatus.AUTHENTICATION_REQUIRED,
        result: undefined,
        error: undefined
      };
    }
    return {
      status: FetchResultStatus.FOUND,
      result: await getThreads({
        forUserId: currentUserId,
        helpRequestId: helpRequestId
      }),
      error: undefined
    };
  }, [currentUserId]);
  const handleThreads = useCallback(setThreadsResult, []);
  const handleThreadsError = useCallback((e: Error) => {
    console.error(e);
    setThreadsResult({
      status: FetchResultStatus.ERROR,
      result: undefined,
      error: "An error occurred while getting messages data."
    });
  }, []);

  useAsyncEffect({
    asyncOperation: fetchThreads,
    handleResponse: handleThreads,
    handleError: handleThreadsError
  });

  return threadsResult;
}
