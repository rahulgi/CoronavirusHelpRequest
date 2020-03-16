import React, { useState, useMemo } from "react";
import styled from "@emotion/styled/macro";

import { HelpRequestCard } from "./common/HelpRequestCard";
import { HelpRequestFilters } from "../firebase/storage/helpRequest";
import { List } from "./common/List";
import { useLocation } from "../hooks/useLocation";
import { DEFAULT_LOCATION, Location } from "./helpers/location";
import { useHelpRequests } from "../hooks/data/useHelpRequests";
import { FetchResultStatus } from "../hooks/data";
import { Loading } from "./common/Loading";
import { Error } from "./common/Error";
import { spacing } from "./helpers/styles";
import { Button, ButtonType } from "./common/Button";

const DEFAULT_DISTANCE = 10; // km

const FilterRow = styled.div`
  display: flex;
  & > *:not(:last-child) {
    margin-right: ${spacing.m};
  }
`;

export const HelpRequestsList: React.FC = () => {
  const [location, setLocation] = useState<Location | undefined>(
    DEFAULT_LOCATION
  );
  const userLocationResult = useLocation();

  const filter = useMemo(
    (): HelpRequestFilters => ({
      ...(location
        ? {
            locationFilter: {
              location,
              distance: DEFAULT_DISTANCE
            }
          }
        : {})
    }),
    [location]
  );

  const helpRequestsResult = useHelpRequests(filter);

  return (
    <div>
      <FilterRow>
        <Button
          type={ButtonType.PRIMARY}
          onClick={() => setLocation(DEFAULT_LOCATION)}
        >
          Nearby requests
        </Button>
        <Button
          type={ButtonType.SECONDARY}
          onClick={() => setLocation(undefined)}
        >
          All requests
        </Button>
      </FilterRow>
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
