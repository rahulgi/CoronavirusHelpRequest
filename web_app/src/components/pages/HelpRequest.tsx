import React, { useState, useCallback } from "react";
import { HelpRequest, HelpRequestCard } from "../common/HelpRequestCard";
import { DefaultLayout } from "../common/DefaultLayout";
import { RouteChildrenProps, RouteComponentProps } from "react-router-dom";
import { useAsyncEffect } from "../../hooks/useAsyncEffect";
import { getHelpRequest } from "../../firebase/storage";

export const HelpRequestPage: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => {
  const [helpRequest, setHelpRequest] = useState<HelpRequest | undefined>();

  const id = match.params.id;

  const fetchHelpRequest = useCallback(() => getHelpRequest({ id }), [id]);
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

  return (
    <DefaultLayout pageTitle={`Request: ${helpRequest && helpRequest.title}`}>
      {helpRequest && <HelpRequestCard request={helpRequest} />}
    </DefaultLayout>
  );
};
