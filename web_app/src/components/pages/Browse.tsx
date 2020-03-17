import React, { useState, useMemo } from "react";
import styled from "@emotion/styled/macro";

import { DefaultLayout } from "../common/DefaultLayout";
import { HelpRequestsList } from "../HelpRequestsList";
import { Map } from "../common/Map";
import {
  Location,
  DEFAULT_LOCATION,
  DEFAULT_LOCATION_NAME
} from "../helpers/location";
import { spacing } from "../../styles/spacing";
import { useLocation } from "../../hooks/useLocation";
import { Button, ButtonType } from "../common/Button";
import { useHelpRequests } from "../../hooks/data/useHelpRequests";
import { HelpRequestFilters } from "../../firebase/storage/helpRequest";
import { PALETTE } from "../../styles/colors";
import { HelpOfferCard } from "../HelpOfferCard";
import { Card, CardBody } from "../common/Material/Card";
import { FetchResultStatus } from "../../hooks/data";
import { RadiusSelector } from "../common/RadiusSelector";

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  & > *:not(:last-child) {
    margin-right: ${spacing.m};
  }
`;

const Filters = styled.div`
  padding: ${spacing.s};
  & > *:not(:last-child) {
    margin-bottom: ${spacing.m};
  }
`;

const QueryInfo = styled.p`
  /* Get rid of yucky paragraph margins. */
  margin: 0;
`;

const DEFAULT_DISTANCE = 10; // km

export const BrowsePage: React.FC = () => {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [locationName, setLocationName] = useState(DEFAULT_LOCATION_NAME);
  const [locationFilter, setLocationFilter] = useState<Location | undefined>(
    location
  );
  const [radius, setRadius] = useState("10");

  const filter = useMemo(
    (): HelpRequestFilters => ({
      ...(locationFilter
        ? {
            locationFilter: {
              location,
              distance: parseInt(radius)
            }
          }
        : {})
    }),
    [locationFilter, radius]
  );

  const helpRequestsResult = useHelpRequests(filter);

  return (
    <DefaultLayout pageTitle="Browse requests">
      {/* <p>
        &ldquo;Ask not what your country can do for you — ask what you can do
        for your country.&rdquo; - John F. Kennedy
      </p> */}
      <Card>
        <CardBody>
          <Map
            onLocationChanged={(location: Location) => {
              setLocation(location);
              setLocationFilter(location);
            }}
            onLocationNameChanged={setLocationName}
            startingLocation={DEFAULT_LOCATION}
            startingLocationName={DEFAULT_LOCATION_NAME}
            locationColor={PALETTE.primary}
            helpRequestsResult={helpRequestsResult}
          />
        </CardBody>
      </Card>
      <Filters>
        <FilterRow>
          <RadiusSelector
            labelText="Filter radius"
            startingRadius="10"
            onRadiusChanged={setRadius}
          />
          <Button
            type={ButtonType.PRIMARY}
            onClick={e => {
              e.preventDefault();
              setLocationFilter(DEFAULT_LOCATION);
            }}
            disabled={helpRequestsResult.status !== FetchResultStatus.FOUND}
          >
            Nearby requests
          </Button>
          <Button
            type={ButtonType.SECONDARY}
            onClick={e => {
              e.preventDefault();
              setLocationFilter(undefined);
            }}
            disabled={helpRequestsResult.status !== FetchResultStatus.FOUND}
          >
            All requests
          </Button>
        </FilterRow>
        <QueryInfo>
          {filter.locationFilter ? (
            <span>
              Showing Help Requests within{" "}
              <b>{filter.locationFilter.distance}km</b> of <b>{locationName}</b>
              .
            </span>
          ) : (
            <span>
              Showing <b>all</b> Help Requests.
            </span>
          )}
        </QueryInfo>
      </Filters>
      <HelpRequestsList helpRequestsResult={helpRequestsResult} />
    </DefaultLayout>
  );
};
