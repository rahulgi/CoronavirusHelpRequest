import { useState, useCallback } from "react";

import { FetchResult, FetchResultStatus } from ".";
import { Thread, getThread } from "../../firebase/storage/messaging";
import { useCurrentUserId } from "../../components/contexts/AuthContext";
import { useAsyncEffect } from "../useAsyncEffect";

export type ThreadResult = FetchResult<Thread>;

export const INITAL_THREAD_RESULT: ThreadResult = {
  status: FetchResultStatus.LOADING,
  result: undefined,
  error: undefined
};

export function useThread({
  helpRequestId,
  didCreateThread = true
}: {
  helpRequestId: string;
  didCreateThread: boolean;
}): ThreadResult {
  const currentUserId = useCurrentUserId();
  const [threadResult, setThreadResult] = useState<ThreadResult>(
    INITAL_THREAD_RESULT
  );

  const fetchThread = useCallback(async (): Promise<ThreadResult> => {
    if (!currentUserId) {
      return {
        status: FetchResultStatus.AUTHENTICATION_REQUIRED,
        result: undefined,
        error: undefined
      };
    }
    const thread = await getThread({
      forUserId: currentUserId,
      forHelpRequestId: helpRequestId
    });
    console.log("Got thread", thread);
    return thread
      ? {
          status: FetchResultStatus.FOUND,
          result: thread,
          error: undefined
        }
      : {
          status: FetchResultStatus.NOT_FOUND,
          result: undefined,
          error: undefined
        };
  }, [currentUserId, helpRequestId]);
  const handleThreadResult = useCallback(setThreadResult, []);
  const handleThreadError = useCallback((e: Error) => {
    console.error(e);
    return {
      status: FetchResultStatus.ERROR,
      result: undefined,
      error: "An error occurred fetching messages. Please refresh the page."
    };
  }, []);

  useAsyncEffect({
    asyncOperation: fetchThread,
    handleResponse: handleThreadResult,
    handleError: handleThreadError
  });

  return threadResult;
}
