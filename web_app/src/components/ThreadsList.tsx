import React from "react";

import { Thread } from "../firebase/storage/messaging";
import { List } from "./common/List";
import { ThreadCard } from "./ThreadCard";

export const ThreadsList: React.FC<{
  threads: Thread[];
  showStatuses?: boolean;
}> = ({ threads, showStatuses = false }) => {
  return threads.length > 0 ? (
    <List>
      {threads.map(thread => (
        <li key={thread.id}>
          <ThreadCard thread={thread} showStatus={showStatuses} />
        </li>
      ))}
    </List>
  ) : (
    <h6>No threads found</h6>
  );
};
