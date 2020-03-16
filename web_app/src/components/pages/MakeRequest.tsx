import React, { useState, useEffect } from "react";

import { DefaultLayout } from "../common/DefaultLayout";
import { useHistory, Redirect } from "react-router-dom";
import { useAuthStatus, AuthStatus } from "../contexts/AuthContext";
import { createHelpRequest } from "../../firebase/storage/helpRequest";
import { CreateResultStatus } from "../../firebase/storage";
import { Map } from "../common/Map";
import { Form } from "../common/Form";

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
          <label htmlFor="title">What do you need help with?</label>
          <input
            type="text"
            name="title"
            onChange={e => setTitle(e.target.value)}
            value={title}
            placeholder="Enter a short title"
          />
        </div>

        <div>
          <label htmlFor="body">Any more information?</label>
          <textarea
            name="body"
            onChange={e => setBody(e.target.value)}
            value={body}
            placeholder="Enter any more relevant details about your request"
          />
        </div>

        <div>
          <input type="submit" value="Create" />
        </div>
      </Form>
    </DefaultLayout>
  );
};
