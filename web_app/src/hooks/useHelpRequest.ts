import { useState, useCallback } from "react";
import { HelpRequest, getHelpRequest } from "../firebase/storage/helpRequest";
import { useAsyncEffect } from "./useAsyncEffect";

export const FINDING_HELP_REQUEST = Symbol("FINDING_HELP_REQUEST");
export const HELP_REQUEST_NOT_FOUND = Symbol("HELP_REQUEST_NOT_FOUND");

type HelpRequestType =
  | typeof FINDING_HELP_REQUEST
  | typeof HELP_REQUEST_NOT_FOUND
  | HelpRequest;

export function useHelpRequest(
  helpRequestId: string
): { helpRequest: HelpRequestType; helpRequestError: string | undefined } {
  const [helpRequest, setHelpRequest] = useState<HelpRequestType>(
    FINDING_HELP_REQUEST
  );
  const [helpRequestError, setHelpRequestError] = useState<string>();

  const fetchHelpRequest = useCallback(async () => {
    const helpRequest = await getHelpRequest({ id: helpRequestId });
    return helpRequest || HELP_REQUEST_NOT_FOUND;
  }, [helpRequestId]);
  const handleHelpRequest = useCallback(setHelpRequest, []);
  const handleHelpRequestError = useCallback(
    (e: Error) => console.error(e),
    []
  );

  useAsyncEffect({
    asyncOperation: fetchHelpRequest,
    handleResponse: handleHelpRequest,
    handleError: handleHelpRequestError
  });

  return { helpRequest, helpRequestError };
}
