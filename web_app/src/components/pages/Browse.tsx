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
import { Button, ButtonType } from "../common/Button";
import { useHelpRequests } from "../../hooks/data/useHelpRequests";
import { HelpRequestFilters } from "../../firebase/storage/helpRequest";
import { PALETTE } from "../../styles/colors";
import { Card, CardBody } from "../common/Material/Card";
import { FetchResultStatus } from "../../hooks/data";
import { RadiusSelector } from "../common/RadiusSelector";
import { useHelpOffers } from "../../hooks/data/useHelpOffers";

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

const HelpRequest = styled.span`
  color: ${PALETTE.error};
`;

const HelpOffer = styled.span`
  color: ${PALETTE.complimentary};
`;

const DEFAULT_DISTANCE = "10"; // km

export const BrowsePage: React.FC = () => {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [locationName, setLocationName] = useState(DEFAULT_LOCATION_NAME);
  const [locationNameFilter, setLocationNameFilter] = useState(
    DEFAULT_LOCATION_NAME
  );
  const [radius, setRadius] = useState(DEFAULT_DISTANCE);
  const [filter, setFilter] = useState<HelpRequestFilters>({
    locationFilter: {
      location,
      distance: parseInt(radius)
    }
  });

  const helpRequestsResult = useHelpRequests(filter);
  const helpOffersResult = useHelpOffers(filter);

  const numHelpRequests = helpRequestsResult.result?.length || 0;
  const numHelpOffers = helpOffersResult.result?.length || 0;

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
            }}
            onLocationNameChanged={setLocationName}
            startingLocation={DEFAULT_LOCATION}
            startingLocationName={DEFAULT_LOCATION_NAME}
            locationRadius={radius}
            locationColor={PALETTE.primary}
            helpRequestsResult={helpRequestsResult}
            helpOffersResult={helpOffersResult}
          />
        </CardBody>
      </Card>
      <Filters>
        <FilterRow>
          <RadiusSelector
            labelText="Filter radius"
            startingRadius={DEFAULT_DISTANCE}
            onRadiusChanged={setRadius}
          />
          <Button
            type={ButtonType.PRIMARY}
            onClick={e => {
              e.preventDefault();
              setFilter({
                locationFilter: {
                  location,
                  distance: parseInt(radius)
                }
              });
              setLocationNameFilter(locationName);
            }}
            disabled={helpRequestsResult.status !== FetchResultStatus.FOUND}
          >
            Nearby requests
          </Button>
          <Button
            type={ButtonType.SECONDARY}
            onClick={e => {
              e.preventDefault();
              setFilter({
                locationFilter: undefined
              });
            }}
            disabled={helpRequestsResult.status !== FetchResultStatus.FOUND}
          >
            All requests
          </Button>
        </FilterRow>
        <QueryInfo>
          {filter.locationFilter ? (
            <span>
              Showing <b>{numHelpRequests}</b>{" "}
              <HelpRequest>
                Help Request{numHelpRequests === 1 ? "" : "s"}
              </HelpRequest>{" "}
              and <b>{numHelpOffers}</b>{" "}
              <HelpOffer>Help Offer{numHelpOffers === 1 ? "" : "s"}</HelpOffer>{" "}
              within <b>{filter.locationFilter.distance}km</b> of{" "}
              <b>{locationNameFilter}</b>.
            </span>
          ) : (
            <span>
              Showing <b>all</b> <HelpRequest>Help Requests</HelpRequest>{" "}
              <b>({numHelpRequests} total)</b> and{" "}
              <HelpOffer>Help Offers</HelpOffer> <b>({numHelpOffers} total)</b>.
            </span>
          )}
        </QueryInfo>
      </Filters>
      <HelpRequestsList helpRequestsResult={helpRequestsResult} />
    </DefaultLayout>
  );
};
