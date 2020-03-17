import React from "react";

import { HelpRequestCard } from "../common/HelpRequestCard";
import { DefaultLayout } from "../common/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import { useHelpRequest } from "../../hooks/data/useHelpRequest";
import { FetchResultStatus } from "../../hooks/data";
import { Loading } from "../common/Loading";
import { Error } from "../common/Error";
import { NotFound } from "../common/NotFound";
import { useCurrentUserId } from "../contexts/AuthContext";
import { MessageThread } from "../MessageThread";
import { useThreads } from "../../hooks/data/useThreads";
import { ThreadsList } from "../ThreadsList";
import { Button, ButtonType } from "../common/Button";

export const HelpRequestPage: React.FC<RouteComponentProps<{
  id: string;
  threadId?: string;
}>> = ({ match, history }) => {
  const { id, threadId } = match.params;
  const currentuserId = useCurrentUserId();
  const requestResult = useHelpRequest(id);
  const isOwnHelpRequest =
    requestResult.result && requestResult.result.creatorId === currentuserId;

  const threadsResult = useThreads(id);

  return (
    <DefaultLayout pageTitle={`Help Request`}>
      {requestResult.status === FetchResultStatus.NOT_FOUND && (
        <NotFound elementName="Help Request" />
      )}
      {requestResult.status === FetchResultStatus.FOUND && (
        <HelpRequestCard request={requestResult.result} showStatusButton />
      )}
      {requestResult.status === FetchResultStatus.LOADING && <Loading />}
      {requestResult.status === FetchResultStatus.ERROR && (
        <Error>{requestResult.error}</Error>
      )}
      {isOwnHelpRequest ? (
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
            <MessageThread helpRequestId={id} />
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
          <MessageThread helpRequestId={id} />
        </div>
      )}
    </DefaultLayout>
  );
};
