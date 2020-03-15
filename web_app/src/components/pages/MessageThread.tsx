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

export const MessageThreadPage: React.FC<RouteComponentProps<{
  id: string;
}>> = ({ match }) => {
  const helpRequestId = match.params.id;

  const [didCreateThread, setDidCreateThread] = useState(false);

  const helpRequestResult = useHelpRequest(helpRequestId);
  const threadResult = useThread({ helpRequestId, didCreateThread });
  console.log("threadResult", threadResult);
  const messagesResult = useMessages(threadResult);

  if (threadResult.status === FetchResultStatus.AUTHENTICATION_REQUIRED) {
    return (
      <Redirect to={`/login?redirectTo=/request/${helpRequestId}/messages`} />
    );
  }

  return (
    <DefaultLayout pageTitle="Message thread with TODO">
      <div>
        {helpRequestResult.status === FetchResultStatus.NOT_FOUND && (
          <NotFound elementName="Help Request" />
        )}
        {helpRequestResult.status === FetchResultStatus.FOUND && (
          <HelpRequestCard request={helpRequestResult.result} />
        )}
        {helpRequestResult.status === FetchResultStatus.LOADING && <Loading />}
        {helpRequestResult.status === FetchResultStatus.ERROR && (
          <Error>{helpRequestResult.error}</Error>
        )}
      </div>
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
      <MessageInput
        helpRequestResult={helpRequestResult}
        threadResult={threadResult}
        triggerThreadRefresh={() => setDidCreateThread(true)}
      />
    </DefaultLayout>
  );
};
