import React, { useState, useCallback } from "react";

import { HelpRequestCard } from "./common/HelpRequestCard";
import { useAsyncEffect } from "../hooks/useAsyncEffect";
import { HelpRequest, getHelpRequests } from "../firebase/storage/helpRequest";
import { List } from "./common/List";

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
              <HelpRequestCard request={request} isLink showActions />
            </li>
          ))}
      </List>
    </div>
  );
};
