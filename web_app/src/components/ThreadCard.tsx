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
import { useHelpOffer } from "../hooks/data/useHelpOffer";
import { FetchResultStatus } from "../hooks/data";
import { HelpOfferStatusChip } from "./common/HelpOfferStatusChip";
import { HelpRequestStatus } from "../firebase/storage/helpRequest";

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: inherit;
`;

interface ThreadCardProps {
  thread: Thread;
  showStatus?: boolean;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({
  thread,
  showStatus = false
}) => {
  const { requestOrOfferId, lastMessageAt, participantIds } = thread;
  const currentUserId = useCurrentUserId();
  const recipientId = participantIds.filter(id => id !== currentUserId)[0];

  // Super hacky
  const helpRequestResult = useHelpRequest(requestOrOfferId);
  const helpOfferResult = useHelpOffer(requestOrOfferId);

  let requestOrOffer =
    helpRequestResult.status === FetchResultStatus.NOT_FOUND
      ? helpOfferResult
      : helpRequestResult;
  const helpRequestNotFound =
    helpRequestResult.status === FetchResultStatus.NOT_FOUND;

  const content = (
    <Card>
      <CardPrimaryAction>
        <CardOverline>
          {recipientId && <UserChip userId={recipientId} />}
        </CardOverline>
        <CardTitle>
          {requestOrOffer.result && requestOrOffer.result.title}
        </CardTitle>
        <CardSubtitle>
          }
          {showStatus && helpRequestNotFound ? (
            <HelpOfferStatusChip />
          ) : (
            helpRequestResult.result && (
              <HelpRequestStatusChip status={helpRequestResult.result.status} />
            )
          )}
          <span>
            Last message: <TimeAgo date={lastMessageAt} />
          </span>
        </CardSubtitle>
      </CardPrimaryAction>
    </Card>
  );

  return helpRequestNotFound ? (
    <StyledLink to={`/offer/${requestOrOfferId}/thread/${thread.id}`}>
      {content}
    </StyledLink>
  ) : helpRequestResult.status !== FetchResultStatus.FOUND ? (
    content
  ) : (
    <StyledLink to={`/request/${requestOrOfferId}/thread/${thread.id}`}>
      {content}
    </StyledLink>
  );
};
