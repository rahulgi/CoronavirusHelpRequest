import React, { useState } from "react";
import styled from "@emotion/styled/macro";
import { Link, useHistory } from "react-router-dom";
import TimeAgo from "react-timeago";

import {
  HelpRequest,
  HelpRequestStatus,
  updateHelpRequestStatus
} from "../../firebase/storage/helpRequest";
import {
  useCurrentUserId,
  useAuthStatus,
  AuthStatus
} from "../contexts/AuthContext";
import { UpdateResultStatus } from "../../firebase/storage";
import { UserChip } from "./UserChip";
import {
  Card,
  CardPrimaryAction,
  CardActions,
  CardActionButtons,
  CardBodyText,
  CardTitle,
  CardSubtitle,
  CardOverline
} from "./Material/Card";
import { Button, ButtonType } from "./Button";
import { HelpRequestStatusChip } from "./HelpRequestStatusChip";

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: inherit;
`;

interface HelpRequestCardProps {
  request: HelpRequest;
  isLink?: boolean;
  showActions?: boolean;
}

export const HelpRequestCard: React.FC<HelpRequestCardProps> = ({
  request,
  isLink = false,
  showActions = false
}) => {
  const history = useHistory();

  const { id, createdAt, creatorId, title, body, distance } = request;
  const [status, setStatus] = useState<HelpRequestStatus>(request.status);
  const [updating, setUpdating] = useState(false);

  const authStatus = useAuthStatus();
  const isLoggedIn = authStatus === AuthStatus.LOGGED_IN;
  const currentUserId = useCurrentUserId();
  const isOwnRequest = isLoggedIn && creatorId === currentUserId;

  function onSendMessageClick(e: React.MouseEvent) {
    e.preventDefault();
    const requestMessageUrl = `/request/${id}/messages`;
    isLoggedIn
      ? history.push(requestMessageUrl)
      : history.push(`/login?redirectTo=${requestMessageUrl}`);
  }

  function onSetStatusClickCreator(newStatus: HelpRequestStatus) {
    return async (e: React.MouseEvent) => {
      e.preventDefault();
      setUpdating(true);
      const updateResult = await updateHelpRequestStatus({
        id,
        status: newStatus
      });
      if (updateResult.status === UpdateResultStatus.UPDATED) {
        setStatus(newStatus);
      }
      setUpdating(false);
    };
  }

  const cardContents = (
    <Card>
      <CardPrimaryAction>
        <CardOverline>
          <UserChip userId={creatorId} />
        </CardOverline>
        <CardTitle>{title}</CardTitle>
        <CardSubtitle>
          <HelpRequestStatusChip status={status} />
          {distance && (
            <span>
              <b>{distance.toPrecision(2)}km away</b>
            </span>
          )}
          <TimeAgo date={createdAt} />
        </CardSubtitle>

        <CardBodyText>{body}</CardBodyText>
      </CardPrimaryAction>

      {showActions && (
        <CardActions>
          <CardActionButtons>
            {isOwnRequest ? (
              (status === HelpRequestStatus.ACTIVE && (
                <Button
                  type={ButtonType.TEXT_ONLY}
                  onClick={onSetStatusClickCreator(HelpRequestStatus.CLAIMED)}
                  disabled={updating}
                >
                  Mark as In Progress
                </Button>
              )) ||
              (status === HelpRequestStatus.CLAIMED && (
                <Button
                  type={ButtonType.TEXT_ONLY}
                  onClick={onSetStatusClickCreator(HelpRequestStatus.RESOLVED)}
                  disabled={updating}
                >
                  Mark as Resolved
                </Button>
              ))
            ) : (
              <>
                <Button
                  type={ButtonType.TEXT_ONLY}
                  onClick={onSendMessageClick}
                >
                  Send a message
                </Button>
              </>
            )}
          </CardActionButtons>
        </CardActions>
      )}
    </Card>
  );

  return isLink ? (
    <StyledLink to={`/request/${id}`}>{cardContents}</StyledLink>
  ) : (
    cardContents
  );
};
