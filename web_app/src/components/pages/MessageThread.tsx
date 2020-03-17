import React, { useState } from "react";

import { DefaultLayout } from "../common/DefaultLayout";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { List } from "../common/List";
import { MessageCard } from "../MessageCard";
import { MessageInput } from "../MessageInput";
import { useHelpRequest } from "../../hooks/data/useHelpRequest";
import { HelpRequestCard } from "../common/HelpRequestCard";
import { FetchResultStatus } from "../../hooks/data";
import { Error } from "../common/Error";
import { Loading } from "../common/Loading";
import { NotFound } from "../common/NotFound";
import { useThread } from "../../hooks/data/useThread";
import { useMessages } from "../../hooks/data/useMessages";
import { useCurrentUserId } from "../contexts/AuthContext";

export const MessageThread: React.FC<{
  helpRequestId: string;
}> = ({ helpRequestId }) => {
  const [didCreateThread, setDidCreateThread] = useState(false);

  const helpRequestResult = useHelpRequest(helpRequestId);
  const threadResult = useThread({ helpRequestId, didCreateThread });
  const messagesResult = useMessages(threadResult);

  return (
    <div>
      <MessageInput
        helpRequestResult={helpRequestResult}
        threadResult={threadResult}
        triggerThreadRefresh={() => setDidCreateThread(true)}
      />
      {messagesResult.status === FetchResultStatus.FOUND && (
        <List>
          {messagesResult.result.map(message => (
            <li key={message.id}>
              <MessageCard message={message} />
            </li>
          ))}
        </List>
      )}
      {messagesResult.status === FetchResultStatus.LOADING && <Loading />}
      {messagesResult.status === FetchResultStatus.ERROR && (
        <Error>{messagesResult.error}</Error>
      )}
    </div>
  );
};
