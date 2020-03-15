import React, { useState } from "react";
import styled from "@emotion/styled/macro";
import { Link, useHistory } from "react-router-dom";

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
import { Card } from "./Card";
import { UpdateResultStatus } from "../../firebase/storage";
import { UserChip } from "./UserChip";

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: inherit;
`;

const Actions = styled.div`
  display: flex;
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

  const { id, createdAt, creatorId, title, body } = request;
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
      <UserChip userId={creatorId} />
      {isOwnRequest && <p>You created this request</p>}
      <h3>{title}</h3>
      <p>Created at: {createdAt.toLocaleString()}</p>
      <p>Status: {status}</p>
      <p>{body}</p>
      {showActions && (
        <Actions>
          {isOwnRequest ? (
            (status === HelpRequestStatus.ACTIVE && (
              <button
                onClick={onSetStatusClickCreator(HelpRequestStatus.CLAIMED)}
                disabled={updating}
              >
                Mark as In Progress
              </button>
            )) ||
            (status === HelpRequestStatus.CLAIMED && (
              <button
                onClick={onSetStatusClickCreator(HelpRequestStatus.RESOLVED)}
                disabled={updating}
              >
                Mark as Resolved
              </button>
            ))
          ) : (
            <>
              <button onClick={onSendMessageClick}>Send a message</button>
            </>
          )}
        </Actions>
      )}
    </Card>
  );

  return isLink ? (
    <StyledLink to={`/request/${id}`}>{cardContents}</StyledLink>
  ) : (
    cardContents
  );
};
