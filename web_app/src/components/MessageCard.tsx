import React from "react";
import styled from "@emotion/styled/macro";

import { Message } from "../firebase/storage/messaging";
import { UserChip } from "./common/UserChip";
import {
  Card,
  CardBodyText,
  CardSubtitle,
  CardBody
} from "./common/Material/Card";
import { useCurrentUserId } from "./contexts/AuthContext";
import { PALETTE } from "../styles/colors";

const StyledCard = styled(Card)<{ isOwnMessage: boolean }>`
  max-width: 70%;
  ${({ isOwnMessage }) => isOwnMessage && "margin-left: auto"};
  background-color: ${({ isOwnMessage }) =>
    isOwnMessage ? PALETTE.secondary : PALETTE.darkGray};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
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
        <Header>
          <UserChip userId={creatorId} />
          <CardSubtitle>{createdAt.toLocaleString()}</CardSubtitle>
        </Header>
        <CardBodyText>{messageText}</CardBodyText>
      </CardBody>
    </StyledCard>
  );
};
