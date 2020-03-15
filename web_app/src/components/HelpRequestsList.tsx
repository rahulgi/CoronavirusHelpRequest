import React, { useState, useCallback } from "react";
import styled from "@emotion/styled/macro";

import { HelpRequestCard } from "./common/HelpRequestCard";
import { useAsyncEffect } from "../hooks/useAsyncEffect";
import { spacing } from "./helpers/styles";
import { HelpRequest, getHelpRequests } from "../firebase/storage/helpRequest";

const List = styled.ul`
  list-style-type: none;

  & *:not(:last-child) {
    margin-bottom: ${spacing.m};
  }
`;

export const HelpRequestsList: React.FC = () => {
  const [requests, setRequests] = useState<HelpRequest[]>();

  const getRequests = useCallback(getHelpRequests, []);
  const handleRequestsResponse = useCallback(setRequests, []);
  const handleRequestsError = useCallback((e: Error) => console.error(e), []);

  useAsyncEffect({
    asyncOperation: getRequests,
    handleResponse: handleRequestsResponse,
    handleError: handleRequestsError
  });

  return (
    <div>
      <List>
        {requests &&
          requests.map(request => (
            <li key={request.id}>
              <HelpRequestCard request={request} isLink />
            </li>
          ))}
      </List>
    </div>
  );
};
