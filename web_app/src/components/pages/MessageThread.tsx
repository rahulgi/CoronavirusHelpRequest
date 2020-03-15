import React, { useEffect, useState, useCallback } from "react";

import { DefaultLayout } from "../common/DefaultLayout";
import {
  Message,
  listenForMessages,
  getThread
} from "../../firebase/storage/messaging";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { useCurrentUserId } from "../contexts/AuthContext";
import { useAsyncEffect } from "../../hooks/useAsyncEffect";
import { List } from "../common/List";
import { MessageCard } from "../MessageCard";
import { MessageInput } from "../MessageInput";
import {
  useHelpRequest,
  FINDING_HELP_REQUEST,
  HELP_REQUEST_NOT_FOUND
} from "../../hooks/useHelpRequest";
import { HelpRequestCard } from "../common/HelpRequestCard";

const FINDING_THREAD = Symbol("FINDING_THREAD");
const THREAD_NOT_FOUND = Symbol("THREAD_NOT_FOUND");
type ThreadForHelpRequest =
  | typeof FINDING_THREAD
  | typeof THREAD_NOT_FOUND
  | string;

export const MessageThreadPage: React.FC<RouteComponentProps<{
  id: string;
}>> = ({ match }) => {
  const currentUserId = useCurrentUserId();

  const [threadForHelpRequest, setThreadForHelpRequest] = useState<
    ThreadForHelpRequest
  >(FINDING_THREAD);
  const [messages, setMessages] = useState<Message[]>();
  const [messagesError, setMessagesError] = useState<string>();

  const helpRequestId = match.params.id;

  const { helpRequest, helpRequestError } = useHelpRequest(helpRequestId);

  const findThreadForHelpRequest = useCallback(async (): Promise<
    ThreadForHelpRequest
  > => {
    if (!currentUserId) {
      return FINDING_THREAD;
    }
    const thread = await getThread({
      forUserId: currentUserId,
      forHelpRequestId: helpRequestId
    });
    return thread ? thread.id : THREAD_NOT_FOUND;
  }, [currentUserId, helpRequestId]);
  const handleThreadForHelpRequest = useCallback(setThreadForHelpRequest, []);
  const handleThreadForHelpRequestError = useCallback((e: Error) => {
    console.error(e);
    setMessagesError(
      "An error occurred fetching messages. Please refresh the page."
    );
  }, []);

  useAsyncEffect({
    asyncOperation: findThreadForHelpRequest,
    handleResponse: handleThreadForHelpRequest,
    handleError: handleThreadForHelpRequestError
  });

  useEffect(() => {
    let unsubscribeFromMessages: () => void;
    if (
      threadForHelpRequest !== FINDING_THREAD &&
      threadForHelpRequest !== THREAD_NOT_FOUND
    ) {
      unsubscribeFromMessages = listenForMessages({
        threadId: threadForHelpRequest,
        setMessages,
        setMessagesError: (e: Error) => {
          console.error(e);
        }
      });
      return () => {
        unsubscribeFromMessages && unsubscribeFromMessages();
        setMessagesError(
          "An error occurred fetching messages. Please refresh the page."
        );
      };
    }
  }, [threadForHelpRequest]);

  if (!currentUserId) {
    return (
      <Redirect to={`/login?redirectTo=/request/${helpRequestId}/messages`} />
    );
  }

  return (
    <DefaultLayout pageTitle="Message thread with TODO">
      {helpRequest !== FINDING_HELP_REQUEST &&
        helpRequest !== HELP_REQUEST_NOT_FOUND && (
          <HelpRequestCard request={helpRequest} />
        )}
      <List>
        {messages &&
          messages.map(message => (
            <li key={message.id}>
              <MessageCard message={message} />
            </li>
          ))}
      </List>
      <MessageInput
        helpRequest={
          helpRequest !== FINDING_HELP_REQUEST &&
          helpRequest !== HELP_REQUEST_NOT_FOUND
            ? helpRequest
            : undefined
        }
        threadId={
          threadForHelpRequest !== FINDING_THREAD &&
          threadForHelpRequest !== THREAD_NOT_FOUND
            ? threadForHelpRequest
            : undefined
        }
        setThread={setThreadForHelpRequest}
        disabled={threadForHelpRequest === FINDING_THREAD}
      />
    </DefaultLayout>
  );
};
