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

const FilterRow = styled.div`
  display: flex;
  & > *:not(:last-child) {
    margin-right: ${spacing.m};
  }
`;

const DEFAULT_DISTANCE = 10; // km

export const BrowsePage: React.FC = () => {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [locationFilter, setLocationFilter] = useState<Location | undefined>(
    location
  );
  const userLocationResult = useLocation();

  const filter = useMemo(
    (): HelpRequestFilters => ({
      ...(locationFilter
        ? {
            locationFilter: {
              location,
              distance: DEFAULT_DISTANCE
            }
          }
        : {})
    }),
    [locationFilter]
  );

  const helpRequestsResult = useHelpRequests(filter);

  return (
    <DefaultLayout pageTitle="Offer help">
      {/* <p>
        &ldquo;Ask not what your country can do for you — ask what you can do
        for your country.&rdquo; - John F. Kennedy
      </p> */}
      <Map
        onLocationChanged={(location: Location) => {
          setLocation(location);
          setLocationFilter(location);
        }}
        startingLocation={DEFAULT_LOCATION}
        startingLocationName={DEFAULT_LOCATION_NAME}
        locationColor={PALETTE.primary}
        helpRequestsResult={helpRequestsResult}
      />
      <FilterRow>
        <Button
          type={ButtonType.PRIMARY}
          onClick={e => {
            e.preventDefault();
            setLocationFilter(DEFAULT_LOCATION);
          }}
        >
          Nearby requests
        </Button>
        <Button
          type={ButtonType.SECONDARY}
          onClick={e => {
            e.preventDefault();
            setLocationFilter(undefined);
          }}
        >
          All requests
        </Button>
      </FilterRow>
      <HelpRequestsList helpRequestsResult={helpRequestsResult} />
    </DefaultLayout>
  );
};
