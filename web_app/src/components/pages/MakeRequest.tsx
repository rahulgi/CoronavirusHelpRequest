import React, { useState } from "react";
import styled from "@emotion/styled/macro";

import { DefaultLayout } from "../common/DefaultLayout";
import { useHistory, Redirect } from "react-router-dom";
import { useAuthStatus, AuthStatus } from "../contexts/AuthContext";
import { createHelpRequest } from "../../firebase/storage/helpRequest";
import { CreateResultStatus } from "../../firebase/storage";
import { Map } from "../common/Map";
import {
  Location,
  DEFAULT_LOCATION_NAME,
  DEFAULT_LOCATION
} from "../helpers/location";
import { PALETTE } from "../../styles/colors";
import { Button, ButtonType } from "../common/Button";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle
} from "../common/Material/Card";
import { InputContainer } from "../common/InputContainer";
import { spacing } from "../../styles/spacing";

const StyledForm = styled.form`
  & > *:not(:last-child) {
    margin-bottom: ${spacing.m};
  }
`;

const StyledBody = styled(CardBody)`
  & > *:not(:last-child) {
    margin-bottom: ${spacing.l};
  }
`;

export const MakeRequestPage: React.FC = () => {
  const history = useHistory();
  const loggedInStatus = useAuthStatus();

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState<string | undefined>();

  const [body, setBody] = useState("");
  const [bodyError, setBodyError] = useState<string | undefined>();

  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);

  const [submissionError, setSubmissionError] = useState<string | undefined>();

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    // TODO validate, show errors
    const createResult = await createHelpRequest({ title, body, location });

    if (createResult.status === CreateResultStatus.CREATED) {
      history.push(`/request/${createResult.result.id}`);
    }
  }

  if (loggedInStatus === AuthStatus.LOGGED_OUT) {
    return <Redirect to="/login?redirectTo=/requestHelp" />;
  }

  return (
    <DefaultLayout pageTitle="Request help">
      <Card>
        <StyledBody>
          <div>
            <CardTitle>Create a Help Request</CardTitle>
            <CardSubtitle>
              A help request lets people know roughly where and what kind of
              help you need. Once someone responds to your help request you can
              message them further details.
            </CardSubtitle>
          </div>
          <StyledForm onSubmit={submitRequest}>
            <Map
              startingLocation={location}
              startingLocationName={DEFAULT_LOCATION_NAME}
              onLocationChanged={setLocation}
              locationColor={PALETTE.error}
            />
            <InputContainer
              labelText="What do you need help with?"
              collapseDescriptionSpace
            >
              <input
                type="text"
                name="title"
                onChange={e => setTitle(e.target.value)}
                value={title}
                placeholder="I need someone to pick up my prescriptions for me."
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
                placeholder="My pharmacy is the Walgreens at 8th Ave and Mission St."
              />
            </InputContainer>
            <Button type={ButtonType.PRIMARY}>Make request</Button>
          </StyledForm>
        </StyledBody>
      </Card>
    </DefaultLayout>
  );
};
