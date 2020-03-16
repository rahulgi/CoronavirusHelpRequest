import React, { useState, useCallback, useMemo } from "react";

import { HelpRequestCard } from "./common/HelpRequestCard";
import { useAsyncEffect } from "../hooks/useAsyncEffect";
import {
  HelpRequest,
  getHelpRequests,
  HelpRequestFilters
} from "../firebase/storage/helpRequest";
import { List } from "./common/List";
import { useLocation } from "../hooks/useLocation";
import { DEFAULT_LOCATION, Location } from "./helpers/location";
import { useHelpRequests } from "../hooks/data/useHelpRequests";
import { FetchResultStatus } from "../hooks/data";
import { Loading } from "./common/Loading";
import { Error } from "./common/Error";

const DEFAULT_DISTANCE = 5; // km

export const HelpRequestsList: React.FC = () => {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const userLocationResult = useLocation();

  const filter = useMemo(
    (): HelpRequestFilters => ({
      locationFilter: {
        location,
        distance: DEFAULT_DISTANCE
      }
    }),
    [location]
  );

  const helpRequestsResult = useHelpRequests(filter);

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
              <HelpRequestCard request={request} isLink showActions />
            </li>
          ))}
      </List>
    </div>
  );
};
