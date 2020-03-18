import React, { useState, useRef } from "react";
import styled from "@emotion/styled/macro";

import {
  createMessage,
  createThread,
  Message
} from "../firebase/storage/messaging";
import { HelpRequest } from "../firebase/storage/helpRequest";
import { ThreadResult } from "../hooks/data/useThread";
import { HelpRequestResult } from "../hooks/data/useHelpRequest";
import { FetchResultStatus } from "../hooks/data";
import { CreateResultStatus, CreateResult } from "../firebase/storage";
import { Error } from "./common/Error";
import { Button, ButtonType } from "./common/Button";
import { spacing } from "../styles/spacing";
import { HelpOfferResult } from "../hooks/data/useHelpOffer";

const MessageInputForm = styled.form`
  display: flex;
  align-items: center;
  & > *:not(:last-child) {
    margin-right: ${spacing.m};
  }
  padding: ${spacing.m};
`;

const InputArea = styled.textarea`
  flex-grow: 1;
`;

interface MessageInputProps {
  requestOrOfferResult: HelpRequestResult | HelpOfferResult;
  threadResult: ThreadResult;
  triggerThreadRefresh?: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  threadResult,
  requestOrOfferResult,
  triggerThreadRefresh
}) => {
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();
  const formRef = useRef<HTMLFormElement>();

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    let threadId = threadResult.result?.id;
    let createResult: CreateResult<Message> | undefined = undefined;

    if (!threadId && requestOrOfferResult.status !== FetchResultStatus.FOUND) {
      return;
    }
    setSending(true);

    if (!threadId && requestOrOfferResult.result) {
      const requestOrOffer = requestOrOfferResult.result;
      const createThreadResult = await createThread({
        requestOrOfferId: requestOrOffer.id,
        participantIds: [requestOrOffer.creatorId]
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
      requestOrOfferResult.status !== FetchResultStatus.FOUND);

  return (
    <MessageInputForm
      onSubmit={sendMessage}
      ref={r => r && (formRef.current = r)}
    >
      <InputArea
        name="new-message"
        value={messageText}
        onChange={e => setMessageText(e.currentTarget.value)}
        autoFocus
      />
      <Button type={ButtonType.PRIMARY} disabled={disabled}>
        Send Message
      </Button>
      {error && <Error>{error}</Error>}
    </MessageInputForm>
  );
};
