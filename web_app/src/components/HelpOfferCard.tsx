import React, { useState, useEffect } from "react";
import styled from "@emotion/styled/macro";

import {
  useHelpOfferForCurrentUser,
  HelpOfferResult
} from "../hooks/data/useHelpOffer";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle
} from "./common/Material/Card";
import { FetchResultStatus } from "../hooks/data";
import { Loading } from "./common/Loading";
import { Map } from "./common/Map";
import {
  DEFAULT_LOCATION,
  DEFAULT_LOCATION_NAME,
  Location
} from "./helpers/location";
import { PALETTE } from "../styles/colors";
import { Button, ButtonType } from "./common/Button";
import { Select, Option } from "./common/Select";
import {
  createHelpOffer,
  HelpOffer,
  updateHelpOffer
} from "../firebase/storage/helpOffer";
import { CreateResult, UpdateResult } from "../firebase/storage";

const OPTIONS: Option[] = [
  { label: "1km", value: "1" },
  { label: "5km", value: "5" },
  { label: "10km", value: "10" },
  { label: "20km", value: "20" },
  { label: "50km", value: "50" }
];

const StyledSelect = styled(Select)`
  max-width: 100px;
`;

export const HelpOfferCard: React.FC = () => {
  const helpOfferResult = useHelpOfferForCurrentUser();
  const [startLocation, setStartLocation] = useState<Location>(
    DEFAULT_LOCATION
  );
  const [startLocationName, setStartLocationName] = useState(
    DEFAULT_LOCATION_NAME
  );
  const [selectedLocation, setSelectedLocation] = useState<Location>(
    DEFAULT_LOCATION
  );
  const [selectedLocationName, setSelectedLocationName] = useState(
    DEFAULT_LOCATION_NAME
  );
  const [newOfferResult, setNewOfferResult] = useState<
    CreateResult<HelpOffer> | UpdateResult<HelpOffer>
  >();
  const [radius, setRadius] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  const helpOffer = newOfferResult?.result || helpOfferResult.result;

  useEffect(() => {
    if (helpOffer) {
      setStartLocation(helpOffer.location);
      setSelectedLocation(helpOffer.location);
      setStartLocationName(helpOffer.locationName);
      setSelectedLocationName(helpOffer.locationName);
      setRadius(helpOffer.radius.toString());
    }
  }, [helpOffer]);

  async function submitHelpOffer(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setNewOfferResult(
      await (helpOffer
        ? updateHelpOffer({
            id: helpOffer.id,
            location: selectedLocation,
            locationName: selectedLocationName,
            radius: parseInt(radius)
          })
        : createHelpOffer({
            location: selectedLocation,
            locationName: selectedLocationName,
            radius: parseInt(radius)
          }))
    );
    setSubmitting(false);
  }

  return (
    <Card>
      <CardBody>
        {helpOfferResult.status === FetchResultStatus.LOADING ? (
          <Loading />
        ) : (
          <>
            <CardTitle>
              {helpOffer ? "You are offering to help!" : "Create a help offer"}
            </CardTitle>
            <CardSubtitle>
              By creating a help offer, you let others know that someone near
              them is offering help. You'll also get notified when a Help
              Request is created in the radius you select.
            </CardSubtitle>
            <Map
              onLocationChanged={setSelectedLocation}
              onLocationNameChanged={setSelectedLocationName}
              locationRadius={radius}
              startingLocation={startLocation}
              startingLocationName={startLocationName}
              locationColor={PALETTE.primary}
            />
            <StyledSelect
              labelText="Offer radius"
              value={radius}
              options={OPTIONS}
              onChange={option => setRadius(option.value)}
              collapseDescriptionSpace
            />
            <p>
              You are available to help within <b>{radius}km</b> of{" "}
              <b>{selectedLocationName}</b>.
            </p>
            <form onSubmit={submitHelpOffer}>
              <Button type={ButtonType.PRIMARY}>
                {submitting ? (
                  <Loading />
                ) : helpOffer ? (
                  "Update help offer"
                ) : (
                  "Create help offer"
                )}
              </Button>
            </form>
          </>
        )}
      </CardBody>
    </Card>
  );
};
