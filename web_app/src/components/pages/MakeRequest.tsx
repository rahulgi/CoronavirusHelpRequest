import React, { useState, useEffect } from "react";
import styled from "@emotion/styled/macro";

import { DefaultLayout } from "../common/DefaultLayout";
import { useHistory, Redirect } from "react-router-dom";
import { spacing } from "../helpers/styles";
import { useAuthStatus, AuthStatus } from "../contexts/AuthContext";
import { createHelpRequest } from "../../firebase/storage/helpRequest";
import { CreateResultStatus } from "../../firebase/storage";
import { Map } from "../common/Map";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 600px;

  & div {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  & > *:not(:last-child) {
    margin-bottom: ${spacing.m};
  }
`;

export const MakeRequestPage: React.FC = () => {
  const history = useHistory();
  const loggedInStatus = useAuthStatus();

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState<string | undefined>();

  const [body, setBody] = useState("");
  const [bodyError, setBodyError] = useState<string | undefined>();

  const [submissionError, setSubmissionError] = useState<string | undefined>();

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    // TODO validate, show errors
    const createResult = await createHelpRequest({ title, body });

    if (createResult.status === CreateResultStatus.CREATED) {
      history.push(`/request/${createResult.result.id}`);
    }
  }

  if (loggedInStatus === AuthStatus.LOGGED_OUT) {
    return <Redirect to="/login?redirectTo=/requestHelp" />;
  }

  return (
    <DefaultLayout pageTitle="Request help">
      <Map />
      <Form onSubmit={submitRequest}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            onChange={e => setTitle(e.target.value)}
            value={title}
          />
        </div>

        <div>
          <label htmlFor="body">Post</label>
          <textarea
            name="body"
            onChange={e => setBody(e.target.value)}
            value={body}
          />
        </div>

        <div>
          <input type="submit" value="Create" />
        </div>
      </Form>
    </DefaultLayout>
  );
};
