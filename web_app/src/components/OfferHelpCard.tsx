import React, { useState, useEffect } from "react";
import styled from "@emotion/styled/macro";

import { useHelpOfferForCurrentUser } from "../hooks/data/useHelpOffer";
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
import {
  createHelpOffer,
  HelpOffer,
  updateHelpOffer
} from "../firebase/storage/helpOffer";
import { CreateResult, UpdateResult } from "../firebase/storage";
import { InputContainer } from "./common/InputContainer";
import { spacing } from "../styles/spacing";
import { RadiusSelector } from "./common/RadiusSelector";

const FormContainer = styled.div`
  & > *:not(:last-child) {
    margin-bottom: ${spacing.m};
  }
`;

const StyledBody = styled(CardBody)`
  & > *:not(:last-child) {
    margin-bottom: ${spacing.l};
  }
`;

export const OfferHelpCard: React.FC = () => {
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
  const [startingRadius, setStartingRadius] = useState("1");
  const [radius, setRadius] = useState(startingRadius);

  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState<string | undefined>();

  const [body, setBody] = useState("");
  const [bodyError, setBodyError] = useState<string | undefined>();

  const helpOffer = newOfferResult?.result || helpOfferResult.result;

  useEffect(() => {
    if (helpOffer) {
      setStartLocation(helpOffer.location);
      setSelectedLocation(helpOffer.location);
      setStartLocationName(helpOffer.locationName);
      setSelectedLocationName(helpOffer.locationName);
      setStartingRadius(helpOffer.radius.toString());
      setRadius(helpOffer.radius.toString());
      setTitle(helpOffer.title);
      setBody(helpOffer.body);
    }
  }, [helpOffer]);

  async function submitHelpOffer(e: React.FormEvent) {
    e.preventDefault();
    if (title.length < 5) {
      setTitleError("Minimum length is 5 characters.");
      return;
    }

    setSubmitting(true);
    setNewOfferResult(
      await (helpOffer
        ? updateHelpOffer({
            id: helpOffer.id,
            location: selectedLocation,
            locationName: selectedLocationName,
            radius: parseInt(radius),
            title,
            body
          })
        : createHelpOffer({
            location: selectedLocation,
            locationName: selectedLocationName,
            radius: parseInt(radius),
            title,
            body
          }))
    );
    setSubmitting(false);
  }

  return (
    <Card>
      <StyledBody>
        {helpOfferResult.status === FetchResultStatus.LOADING ? (
          <Loading />
        ) : (
          <>
            <div>
              <CardTitle>
                {helpOffer
                  ? "You are offering to help!"
                  : "Create a help offer"}
              </CardTitle>
              <CardSubtitle>
                By creating a help offer, you let others know that someone near
                them is offering help. You'll also get notified when a Help
                Request is created in the radius you select.
              </CardSubtitle>
            </div>
            <FormContainer>
              <InputContainer
                labelText="What are you offering?"
                validationStatus={
                  titleError
                    ? { success: false, message: titleError }
                    : { success: true }
                }
              >
                <input
                  type="text"
                  name="title"
                  onChange={e => setTitle(e.target.value)}
                  value={title}
                  placeholder="I can help pick up groceries or prescriptions!"
                />
              </InputContainer>
              <InputContainer
                labelText="Any more information?"
                collapseDescriptionSpace
              >
                <textarea
                  name="body"
                  onChange={e => setBody(e.target.value)}
                  value={body}
                  placeholder="I don't have a car but I'm near the Walgreens at 8th Ave and Mission st."
                />
              </InputContainer>
              <Map
                onLocationChanged={setSelectedLocation}
                onLocationNameChanged={setSelectedLocationName}
                locationRadius={radius}
                startingLocation={startLocation}
                startingLocationName={startLocationName}
                locationColor={PALETTE.complimentary}
                showCircle
              />
              <RadiusSelector
                labelText="Offer radius"
                startingRadius={startingRadius}
                onRadiusChanged={setRadius}
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
            </FormContainer>
          </>
        )}
      </StyledBody>
    </Card>
  );
};
