import { useState, useEffect } from "react";

import { Message, listenForMessages } from "../../firebase/storage/messaging";
import { FetchResult, FetchResultStatus } from ".";
import { ThreadResult } from "./useThread";

export type MessagesResult = FetchResult<Message[]>;

export function useMessages(threadResult: ThreadResult): MessagesResult {
  const [messagesResult, setMessagesResult] = useState<MessagesResult>({
    status: FetchResultStatus.LOADING,
    result: undefined,
    error: undefined
  });

  useEffect(() => {
    console.log(threadResult);
    switch (threadResult.status) {
      case FetchResultStatus.LOADING:
        setMessagesResult({
          status: FetchResultStatus.LOADING,
          result: undefined,
          error: undefined
        });
        break;
      case FetchResultStatus.NOT_FOUND: {
        setMessagesResult({
          status: FetchResultStatus.NOT_FOUND,
          result: undefined,
          error: undefined
        });
        break;
      }
      case FetchResultStatus.AUTHENTICATION_REQUIRED:
        setMessagesResult({
          status: FetchResultStatus.AUTHENTICATION_REQUIRED,
          result: undefined,
          error: undefined
        });
        break;
      case FetchResultStatus.ERROR:
        setMessagesResult({
          status: FetchResultStatus.ERROR,
          result: undefined,
          error: "Error loading messages."
        });
        break;
      case FetchResultStatus.FOUND: {
        const unsubscribeFromMessages = listenForMessages({
          threadId: threadResult.result.id,
          setMessages: (messages: Message[]) => {
            setMessagesResult({
              status: FetchResultStatus.FOUND,
              result: messages,
              error: undefined
            });
          },
          setMessagesError: (e: Error) => {
            console.error(e);
            setMessagesResult({
              status: FetchResultStatus.ERROR,
              result: undefined,
              error: "Error loading messages."
            });
          }
        });
        return () => {
          unsubscribeFromMessages && unsubscribeFromMessages();
        };
      }
    }
  }, [threadResult]);

  return messagesResult;
}
