import React, { useState, useMemo } from "react";
import styled from "@emotion/styled/macro";

import { HelpRequestCard } from "./common/HelpRequestCard";
import { List } from "./common/List";
import { FetchResultStatus } from "../hooks/data";
import { Loading } from "./common/Loading";
import { Error } from "./common/Error";
import { HelpRequestsResult } from "../hooks/data/useHelpRequests";

export const HelpRequestsList: React.FC<{
  helpRequestsResult: HelpRequestsResult;
}> = ({ helpRequestsResult }) => {
  return (
    <div>
      <List>
        {helpRequestsResult.status === FetchResultStatus.LOADING && <Loading />}
        {helpRequestsResult.status === FetchResultStatus.ERROR && (
          <Error>{helpRequestsResult.error}</Error>
        )}
        {helpRequestsResult.status === FetchResultStatus.FOUND &&
          helpRequestsResult.result.map(request => (
            <li key={request.id}>
              <HelpRequestCard
                request={request}
                isLink
                showStatusButton
                showMessageButton
              />
            </li>
          ))}
      </List>
    </div>
  );
};
