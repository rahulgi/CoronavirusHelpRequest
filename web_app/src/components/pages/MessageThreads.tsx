import React, { useCallback, useState } from "react";

import { DefaultLayout } from "../common/DefaultLayout";
import { List } from "../common/List";
import { getThreads, Thread } from "../../firebase/storage/messaging";
import { useAsyncEffect } from "../../hooks/useAsyncEffect";
import { ThreadCard } from "../ThreadCard";
import { useCurrentUserId } from "../contexts/AuthContext";
import { Redirect } from "react-router-dom";

export const MessageThreadsPage: React.FC = () => {
  const currentUserId = useCurrentUserId();

  const [threads, setThreads] = useState<Thread[] | undefined>();

  const fetchThreads = useCallback(() => {
    return currentUserId
      ? getThreads({ forUserId: currentUserId })
      : Promise.resolve(undefined);
  }, [currentUserId]);
  const handleThreads = useCallback(setThreads, []);
  const handleThreadsError = useCallback((e: Error) => console.error(e), []);

  useAsyncEffect({
    asyncOperation: fetchThreads,
    handleResponse: handleThreads,
    handleError: handleThreadsError
  });

  if (!currentUserId) {
    return <Redirect to="/login?redirectTo=/messages" />;
  }

  return (
    <DefaultLayout pageTitle="Messages">
      <List>
        {threads &&
          threads.map(thread => (
            <li key={thread.id}>
              <ThreadCard thread={thread} />
            </li>
          ))}
      </List>
    </DefaultLayout>
  );
};
