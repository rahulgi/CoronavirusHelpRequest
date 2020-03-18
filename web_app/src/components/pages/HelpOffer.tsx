import React from "react";

import { HelpOfferCard } from "../common/HelpOfferCard";
import { DefaultLayout } from "../common/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import { useHelpOffer } from "../../hooks/data/useHelpOffer";
import { FetchResultStatus } from "../../hooks/data";
import { Loading } from "../common/Loading";
import { Error } from "../common/Error";
import { NotFound } from "../common/NotFound";
import { useCurrentUserId } from "../contexts/AuthContext";
import { HelpOfferMessageThread } from "../MessageThread";
import { useThreads } from "../../hooks/data/useThreads";
import { ThreadsList } from "../ThreadsList";
import { Button, ButtonType } from "../common/Button";

export const HelpOfferPage: React.FC<RouteComponentProps<{
  id: string;
  threadId?: string;
}>> = ({ match, history }) => {
  const { id, threadId } = match.params;
  const currentuserId = useCurrentUserId();
  const requestResult = useHelpOffer(id);
  const isOwnHelpOffer =
    requestResult.result && requestResult.result.creatorId === currentuserId;

  const threadsResult = useThreads(id);

  return (
    <DefaultLayout pageTitle={`Help Request`}>
      {requestResult.status === FetchResultStatus.NOT_FOUND && (
        <NotFound elementName="Help Request" />
      )}
      {requestResult.status === FetchResultStatus.FOUND && (
        <HelpOfferCard offer={requestResult.result} />
      )}
      {requestResult.status === FetchResultStatus.LOADING && <Loading />}
      {requestResult.status === FetchResultStatus.ERROR && (
        <Error>{requestResult.error}</Error>
      )}
      {isOwnHelpOffer ? (
        threadId ? (
          <div>
            <Button
              type={ButtonType.SECONDARY}
              onClick={e => {
                e.preventDefault();
                history.push(`/request/${id}`);
              }}
            >
              Back to all messages
            </Button>
            <HelpOfferMessageThread helpOfferId={id} />
          </div>
        ) : (
          <div>
            <h4>Messages</h4>
            {threadsResult.result && (
              <ThreadsList threads={threadsResult.result} />
            )}
          </div>
        )
      ) : (
        <div>
          <HelpOfferMessageThread helpOfferId={id} />
        </div>
      )}
    </DefaultLayout>
  );
};
