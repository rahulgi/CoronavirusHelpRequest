import React, { useState } from "react";
import styled from "@emotion/styled/macro";
import { Link, useHistory } from "react-router-dom";
import TimeAgo from "react-timeago";

import { HelpOffer } from "../../firebase/storage/helpOffer";
import {
  useCurrentUserId,
  useAuthStatus,
  AuthStatus
} from "../contexts/AuthContext";
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
import { PALETTE } from "../../styles/colors";
import { spacing } from "../../styles/spacing";

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: inherit;
`;

const Chip = styled.div`
  display: inline-flex;
  border: 1px solid ${PALETTE.complimentary};
  border-radius: 8px;
  padding: ${spacing.xs};
  color: ${PALETTE.complimentary};
`;

interface HelpOfferCardProps {
  offer: HelpOffer;
  isLink?: boolean;
  showMessageButton?: boolean;
}

export const HelpOfferCard: React.FC<HelpOfferCardProps> = ({
  offer,
  isLink = false,
  showMessageButton = false
}) => {
  const history = useHistory();

  const { id, createdAt, creatorId, title, body, distance } = offer;

  const authStatus = useAuthStatus();
  const isLoggedIn = authStatus === AuthStatus.LOGGED_IN;
  const currentUserId = useCurrentUserId();
  const isOwnOffer = isLoggedIn && creatorId === currentUserId;

  function onSendMessageClick(e: React.MouseEvent) {
    e.preventDefault();
    const offerMessageUrl = `/offer/${id}/messages`;
    isLoggedIn
      ? history.push(offerMessageUrl)
      : history.push(`/login?redirectTo=${offerMessageUrl}`);
  }

  const bodyContent = (
    <>
      <CardOverline>
        <UserChip userId={creatorId} />
      </CardOverline>
      <CardTitle>{title}</CardTitle>
      <CardSubtitle>
        <Chip>Offering help</Chip>
        {distance && (
          <span>
            <b>{distance.toPrecision(2)}km away</b>
          </span>
        )}
        <TimeAgo date={createdAt} />
      </CardSubtitle>

      <CardBodyText>{body}</CardBodyText>
    </>
  );

  const cardContents = (
    <Card>
      {isLink ? (
        <CardPrimaryAction>{bodyContent}</CardPrimaryAction>
      ) : (
        <CardBody>{bodyContent}</CardBody>
      )}

      {showMessageButton && (
        <CardActions>
          <CardActionButtons>
            {showMessageButton &&
              (isOwnOffer ? (
                <Button
                  type={ButtonType.SECONDARY}
                  onClick={() => history.push(`/offer/${id}`)}
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
          </CardActionButtons>
        </CardActions>
      )}
    </Card>
  );

  return isLink ? (
    <StyledLink to={`/offer/${id}`}>{cardContents}</StyledLink>
  ) : (
    cardContents
  );
};
