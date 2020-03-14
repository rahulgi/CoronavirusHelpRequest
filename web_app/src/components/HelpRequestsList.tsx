import React, { useEffect, useState } from "react";

import {
  getFirestore,
  Collections,
  mapQueryDocToHelpRequest
} from "../firebase/storage";
import { HelpRequest, HelpRequestCard } from "./common/HelpRequestCard";

const storage = getFirestore();

async function getHelpRequests(): Promise<HelpRequest[]> {
  const querySnapshot = await storage
    .collection(Collections.HelpRequests)
    .get();
  return querySnapshot.docs.map(mapQueryDocToHelpRequest);
}

export const HelpRequestsList: React.FC = () => {
  const [requests, setRequests] = useState<HelpRequest[]>();

  useEffect(() => {
    getHelpRequests().then(result => setRequests(result));
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
