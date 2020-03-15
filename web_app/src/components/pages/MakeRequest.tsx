import React, { useState } from "react";
import styled from "@emotion/styled/macro";

import { DefaultLayout } from "../common/DefaultLayout";
import {
  getFirestore,
  Collections,
  createHelpRequest
} from "../../firebase/storage";
import { useHistory } from "react-router-dom";
import { spacing } from "../helpers/styles";

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

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState<string | undefined>();

  const [body, setBody] = useState("");
  const [bodyError, setBodyError] = useState<string | undefined>();

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    const newRequestId = await createHelpRequest({ title, body });
    history.push(`/request/${newRequestId}`);
  }

  return (
    <DefaultLayout pageTitle="Request help">
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
