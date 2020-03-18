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
  CardBody,
  CardTitle,
  CardSubtitle,
  CardOverline
} from "./Material/Card";
import { Button, ButtonType } from "./Button";
import { HelpRequestStatusChip } from "./HelpRequestStatusChip";
import { spacing } from "../../styles/spacing";

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: inherit;
`;

interface HelpRequestCardProps {
  request: HelpRequest;
  isLink?: boolean;
  showMessageButton?: boolean;
  showStatusButton?: boolean;
}

const StyledCardBodyText = styled(CardBodyText)`
  margin-top: ${spacing.m};
`;

export const HelpRequestCard: React.FC<HelpRequestCardProps> = ({
  request,
  isLink = false,
  showStatusButton = false,
  showMessageButton = false
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
    const requestMessageUrl = `/request/${id}`;
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

  const showActions =
    (showStatusButton && status !== HelpRequestStatus.RESOLVED) ||
    showMessageButton;

  const bodyContent = (
    <>
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

      <StyledCardBodyText>{body}</StyledCardBodyText>
    </>
  );

  const cardContents = (
    <Card>
      {isLink ? (
        <CardPrimaryAction>{bodyContent}</CardPrimaryAction>
      ) : (
        <CardBody>{bodyContent}</CardBody>
      )}

      {showActions && (
        <CardActions>
          <CardActionButtons>
            {showMessageButton &&
              (isOwnRequest ? (
                <Button
                  type={ButtonType.SECONDARY}
                  onClick={() => history.push(`/request/${id}`)}
                >
                  View Messages
                </Button>
              ) : (
                <Button
                  type={ButtonType.SECONDARY}
                  onClick={onSendMessageClick}
                >
                  Message
                </Button>
              ))}
            {showStatusButton &&
              isOwnRequest &&
              status === HelpRequestStatus.ACTIVE && (
                // Disabled "CLAIMED" state for now
                <Button
                  type={ButtonType.SECONDARY}
                  onClick={onSetStatusClickCreator(HelpRequestStatus.RESOLVED)}
                  disabled={updating}
                >
                  Mark as Resolved
                </Button>
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
