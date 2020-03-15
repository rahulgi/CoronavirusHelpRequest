import React, { useState, useCallback } from "react";

import {
  getFirestore,
  Collections,
  mapQueryDocToHelpRequest
} from "../firebase/storage";
import { HelpRequest, HelpRequestCard } from "./common/HelpRequestCard";
import { useAsyncEffect } from "../hooks/useAsyncEffect";

const storage = getFirestore();

async function getHelpRequests(): Promise<HelpRequest[]> {
  const querySnapshot = await storage
    .collection(Collections.HelpRequests)
    .get();
  return querySnapshot.docs.map(mapQueryDocToHelpRequest);
}

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
      <ul>
        {requests &&
          requests.map(request => (
            <li key={request.id}>
              <HelpRequestCard request={request} />
            </li>
          ))}
      </ul>
    </div>
  );
};
