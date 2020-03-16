import React from "react";
import TimeAgo from "react-timeago";
import styled from "@emotion/styled/macro";
import { Link } from "react-router-dom";

import { Thread } from "../firebase/storage/messaging";
import {
  Card,
  CardPrimaryAction,
  CardOverline,
  CardTitle,
  CardSubtitle
} from "./common/Material/Card";
import { UserChip } from "./common/UserChip";
import { useCurrentUserId } from "./contexts/AuthContext";
import { useHelpRequest } from "../hooks/data/useHelpRequest";
import { HelpRequestStatusChip } from "./common/HelpRequestStatusChip";

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: inherit;
`;

interface ThreadCardProps {
  thread: Thread;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
  const { helpRequestId, lastMessageAt, participantIds } = thread;
  const currentUserId = useCurrentUserId();
  const recipientId = participantIds.filter(id => id !== currentUserId)[0];
  const helpRequestResult = useHelpRequest(helpRequestId);

  return (
    <StyledLink to={`request/${helpRequestId}/messages`}>
      <Card>
        <CardPrimaryAction>
          <CardOverline>
            {recipientId && <UserChip userId={recipientId} />}
          </CardOverline>
          <CardTitle>
            {helpRequestResult.result && helpRequestResult.result.title}
          </CardTitle>
          <CardSubtitle>
            {helpRequestResult.result && (
              <HelpRequestStatusChip status={helpRequestResult.result.status} />
            )}
            <span>
              Last message: <TimeAgo date={lastMessageAt} />
            </span>
          </CardSubtitle>
        </CardPrimaryAction>
      </Card>
    </StyledLink>
  );
};
