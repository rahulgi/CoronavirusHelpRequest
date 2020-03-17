import React from "react";
import styled from "@emotion/styled/macro";

import { Message } from "../firebase/storage/messaging";
import { UserChip } from "./common/UserChip";
import {
  Card,
  CardOverline,
  CardBodyText,
  CardSubtitle,
  CardBody
} from "./common/Material/Card";
import { useCurrentUserId } from "./contexts/AuthContext";

const StyledCard = styled(Card)<{ isOwnMessage: boolean }>`
  max-width: 70%;
  ${({ isOwnMessage }) => isOwnMessage && "margin-left: auto"}
`;

interface MessageCardProps {
  message: Message;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  const { creatorId, createdAt, message: messageText } = message;
  const isOwnMessage = useCurrentUserId() === creatorId;

  return (
    <StyledCard isOwnMessage={isOwnMessage}>
      <CardBody>
        <CardOverline>
          <UserChip userId={creatorId} />
        </CardOverline>
        <CardSubtitle>{createdAt.toLocaleString()}</CardSubtitle>
        <CardBodyText>{messageText}</CardBodyText>
      </CardBody>
    </StyledCard>
  );
};
