import React from "react";
import { Redirect } from "react-router-dom";

import { DefaultLayout } from "../common/DefaultLayout";
import { List } from "../common/List";
import { ThreadCard } from "../ThreadCard";
import { useThreads } from "../../hooks/data/useThreads";
import { FetchResultStatus } from "../../hooks/data";
import { Loading } from "../common/Loading";
import { Error } from "../common/Error";

export const MessageThreadsPage: React.FC = () => {
  const threadsResult = useThreads();

  if (threadsResult.status === FetchResultStatus.AUTHENTICATION_REQUIRED) {
    return <Redirect to="/login?redirectTo=/messages" />;
  }

  return (
    <DefaultLayout pageTitle="Messages">
      {threadsResult.status === FetchResultStatus.LOADING && <Loading />}
      {threadsResult.status === FetchResultStatus.ERROR && (
        <Error>{threadsResult.error}</Error>
      )}
      {threadsResult.status === FetchResultStatus.FOUND && (
        <List>
          {threadsResult.result.map(thread => (
            <li key={thread.id}>
              <ThreadCard thread={thread} />
            </li>
          ))}
        </List>
      )}
    </DefaultLayout>
  );
};
