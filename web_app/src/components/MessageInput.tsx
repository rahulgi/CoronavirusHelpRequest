import React, { useState } from "react";
import styled from "@emotion/styled/macro";

import { spacing } from "./helpers/styles";
import { createMessage, createThread } from "../firebase/storage/messaging";
import { HelpRequest } from "../firebase/storage/helpRequest";
import { useCurrentUserId } from "./contexts/AuthContext";

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
  helpRequest?: HelpRequest;
  disabled?: boolean;
  threadId?: string;
  setThread: (threadId: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  threadId,
  helpRequest,
  disabled,
  setThread
}) => {
  const currentUserId = useCurrentUserId();
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!helpRequest || !currentUserId) {
      return;
    }
    setSending(true);
    let threadToPostTo = threadId;
    if (!threadToPostTo) {
      threadToPostTo = await createThread({
        helpRequestId: helpRequest.id,
        participantIds: [helpRequest.creatorId, currentUserId]
      });
      setThread(threadToPostTo);
    }
    await createMessage({ threadId: threadToPostTo, message: messageText });
    setSending(false);
    setMessageText("");
  }

  return (
    <Form onSubmit={sendMessage}>
      <textarea
        name="new-message"
        value={messageText}
        onChange={e => setMessageText(e.target.value)}
      />
      <input
        type="submit"
        value="Send"
        disabled={disabled || sending}
        autoFocus
      />
    </Form>
  );
};
