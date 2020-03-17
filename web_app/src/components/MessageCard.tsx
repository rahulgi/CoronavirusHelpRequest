import React from "react";

import { Message } from "../firebase/storage/messaging";
import { UserChip } from "./common/UserChip";
import {
  Card,
  CardOverline,
  CardBodyText,
  CardSubtitle,
  CardBody
} from "./common/Material/Card";

interface MessageCardProps {
  message: Message;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  const { creatorId, createdAt, message: messageText } = message;

  return (
    <Card>
      <CardBody>
        <CardOverline>
          <UserChip userId={creatorId} />
        </CardOverline>
        <CardSubtitle>{createdAt.toLocaleString()}</CardSubtitle>
        <CardBodyText>{messageText}</CardBodyText>
      </CardBody>
    </Card>
  );
};
