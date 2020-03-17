import React, { useState } from "react";

import { DefaultLayout } from "../common/DefaultLayout";
import { useHistory, Redirect } from "react-router-dom";
import { useAuthStatus, AuthStatus } from "../contexts/AuthContext";
import { createHelpRequest } from "../../firebase/storage/helpRequest";
import { CreateResultStatus } from "../../firebase/storage";
import { Map } from "../common/Map";
import { Form } from "../common/Form";
import {
  Location,
  DEFAULT_LOCATION_NAME,
  DEFAULT_LOCATION
} from "../helpers/location";
import { PALETTE } from "../../styles/colors";
import { Button, ButtonType } from "../common/Button";

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
      <p>
        Select the location that you're looking for help in. This is just to
        help find people who can help near you, so it doesn't need to be your
        exact address.
      </p>
      <Map
        startingLocation={location}
        startingLocationName={DEFAULT_LOCATION_NAME}
        onLocationChanged={setLocation}
        locationColor={PALETTE.error}
      />
      <Form onSubmit={submitRequest}>
        <div>
          <label htmlFor="title">What do you need help with?</label>
          <input
            type="text"
            name="title"
            onChange={e => setTitle(e.target.value)}
            value={title}
            placeholder="I need someone to pick up my prescriptions for me."
          />
        </div>

        <div>
          <label htmlFor="body">Any more information?</label>
          <textarea
            name="body"
            onChange={e => setBody(e.target.value)}
            value={body}
            placeholder="My pharmacy is the Walgreens at 8th Ave and Mission St."
          />
        </div>

        <div>
          <Button type={ButtonType.PRIMARY}>Make request</Button>
        </div>
      </Form>
    </DefaultLayout>
  );
};
