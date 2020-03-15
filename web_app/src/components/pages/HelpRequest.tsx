import React from "react";

import { HelpRequestCard } from "../common/HelpRequestCard";
import { DefaultLayout } from "../common/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import { useHelpRequest } from "../../hooks/data/useHelpRequest";
import { FetchResultStatus } from "../../hooks/data";
import { Loading } from "../common/Loading";
import { Error } from "../common/Error";
import { NotFound } from "../common/NotFound";

export const HelpRequestPage: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => {
  const id = match.params.id;

  const requestResult = useHelpRequest(id);

  return (
    <DefaultLayout pageTitle={`Help Request`}>
      {requestResult.status === FetchResultStatus.NOT_FOUND && (
        <NotFound elementName="Help Request" />
      )}
      {requestResult.status === FetchResultStatus.FOUND && (
        <HelpRequestCard request={requestResult.result} showActions />
      )}
      {requestResult.status === FetchResultStatus.LOADING && <Loading />}
      {requestResult.status === FetchResultStatus.ERROR && (
        <Error>{requestResult.error}</Error>
      )}
    </DefaultLayout>
  );
};
