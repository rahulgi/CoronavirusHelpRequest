import React, { useState } from "react";

import { List } from "./common/List";
import { MessageCard } from "./MessageCard";
import { MessageInput } from "./MessageInput";
import {
  useHelpRequest,
  HelpRequestResult
} from "../hooks/data/useHelpRequest";
import { FetchResultStatus } from "../hooks/data";
import { Error } from "./common/Error";
import { Loading } from "./common/Loading";
import { useThread } from "../hooks/data/useThread";
import { useMessages } from "../hooks/data/useMessages";
import { HelpOfferResult, useHelpOffer } from "../hooks/data/useHelpOffer";

export const GenericThread: React.FC<{
  requestOrOfferId: string;
  requestOrOfferResult: HelpRequestResult | HelpOfferResult;
}> = ({ requestOrOfferId, requestOrOfferResult }) => {
  const [didCreateThread, setDidCreateThread] = useState(false);
  const threadResult = useThread({
    requestOrOffer: requestOrOfferId,
    didCreateThread
  });
  const messagesResult = useMessages(threadResult);
  return (
    <div>
      <MessageInput
        requestOrOfferResult={requestOrOfferResult}
        threadResult={threadResult}
        triggerThreadRefresh={() => setDidCreateThread(true)}
      />
      {messagesResult.status === FetchResultStatus.FOUND &&
        messagesResult.result.length === 0 && <h6>No messages yet!</h6>}
      {messagesResult.status === FetchResultStatus.FOUND &&
        messagesResult.result.length > 0 && (
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

export const HelpRequestMessageThread: React.FC<{
  helpRequestId: string;
}> = ({ helpRequestId }) => {
  const helpRequestResult = useHelpRequest(helpRequestId);
  return (
    <GenericThread
      requestOrOfferId={helpRequestId}
      requestOrOfferResult={helpRequestResult}
    />
  );
};

export const HelpOfferMessageThread: React.FC<{
  helpOfferId: string;
}> = ({ helpOfferId }) => {
  const helpOfferResult = useHelpOffer(helpOfferId);

  return (
    <GenericThread
      requestOrOfferId={helpOfferId}
      requestOrOfferResult={helpOfferResult}
    />
  );
};
