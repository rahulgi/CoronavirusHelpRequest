import { useState, useCallback } from "react";

import {
  HelpRequest,
  getHelpRequest
} from "../../firebase/storage/helpRequest";
import { useAsyncEffect } from "../useAsyncEffect";
import { FetchResultStatus, FetchResult } from ".";

export type HelpRequestResult = FetchResult<HelpRequest>;

export function useHelpRequest(helpRequestId: string): HelpRequestResult {
  const [helpRequestResult, setHelpRequestResult] = useState<HelpRequestResult>(
    {
      status: FetchResultStatus.LOADING,
      result: undefined,
      error: undefined
    }
  );

  const fetchHelpRequest = useCallback(async (): Promise<HelpRequestResult> => {
    const helpRequest = await getHelpRequest({ id: helpRequestId });
    return helpRequest
      ? {
          status: FetchResultStatus.FOUND,
          result: helpRequest,
          error: undefined
        }
      : {
          status: FetchResultStatus.NOT_FOUND,
          result: undefined,
          error: undefined
        };
  }, [helpRequestId]);
  const handleHelpRequest = useCallback(setHelpRequestResult, []);
  const handleHelpRequestError = useCallback((e: Error) => {
    console.error(e);
    setHelpRequestResult({
      status: FetchResultStatus.ERROR,
      result: undefined,
      error: "An error occurred while getting data for this Help Request."
    });
  }, []);

  useAsyncEffect({
    asyncOperation: fetchHelpRequest,
    handleResponse: handleHelpRequest,
    handleError: handleHelpRequestError
  });

  return helpRequestResult;
}
