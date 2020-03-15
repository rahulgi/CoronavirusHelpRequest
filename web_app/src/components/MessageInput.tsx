import React, { useState } from "react";
import styled from "@emotion/styled/macro";

import { spacing } from "./helpers/styles";
import {
  createMessage,
  createThread,
  Message
} from "../firebase/storage/messaging";
import { HelpRequest } from "../firebase/storage/helpRequest";
import { useCurrentUserId } from "./contexts/AuthContext";
import { ThreadResult } from "../hooks/data/useThread";
import { HelpRequestResult } from "../hooks/data/useHelpRequest";
import { FetchResultStatus } from "../hooks/data";
import { CreateResultStatus, CreateResult } from "../firebase/storage";
import { Error } from "./common/Error";

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

interface MessageInputProps {
  helpRequestResult: HelpRequestResult;
  threadResult: ThreadResult;
  triggerThreadRefresh?: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  threadResult,
  helpRequestResult,
  triggerThreadRefresh
}) => {
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    let threadId = threadResult.result?.id;
    let createResult: CreateResult<Message> | undefined = undefined;

    if (!threadId && helpRequestResult.status !== FetchResultStatus.FOUND) {
      return;
    }
    setSending(true);

    if (!threadId) {
      const helpRequest = helpRequestResult.result as HelpRequest;
      const createThreadResult = await createThread({
        helpRequestId: helpRequest.id,
        participantIds: [helpRequest.creatorId]
      });
      if (createThreadResult.status === CreateResultStatus.CREATED) {
        threadId = createThreadResult.result.id;
        triggerThreadRefresh && triggerThreadRefresh();
      } else {
        setError("An error occurred sending the message.");
      }
    }

    if (threadId) {
      setSending(false);
      createResult = await createMessage({
        threadId,
        message: messageText
      });
    }

    setSending(false);

    if (createResult?.status === CreateResultStatus.CREATED) {
      setMessageText("");
    }
  }

  const disabled =
    sending ||
    (threadResult.status !== FetchResultStatus.FOUND &&
      helpRequestResult.status !== FetchResultStatus.FOUND);

  return (
    <Form onSubmit={sendMessage}>
      <textarea
        name="new-message"
        value={messageText}
        onChange={e => setMessageText(e.target.value)}
      />
      <input type="submit" value="Send" disabled={disabled} autoFocus />
      {error && <Error>{error}</Error>}
    </Form>
  );
};
