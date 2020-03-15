import React from "react";
import styled from "@emotion/styled/macro";
import { Link } from "react-router-dom";

import { Card } from "./common/Card";
import { Thread } from "../firebase/storage/messaging";

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: inherit;
`;

interface ThreadCardProps {
  thread: Thread;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
  const { helpRequestId, lastMessageAt } = thread;

  return (
    <StyledLink to={`request/${helpRequestId}/messages`}>
      <Card>
        <h2>Thread with TODO</h2>
        <p>Last message at: {lastMessageAt.toLocaleString()}</p>
      </Card>
    </StyledLink>
  );
};
