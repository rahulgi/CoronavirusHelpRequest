import React from "react";

import { Message } from "../firebase/storage/messaging";
import { Card } from "./common/Card";
import { UserChip } from "./common/UserChip";

interface MessageCardProps {
  message: Message;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  const { creatorId, createdAt, message: messageText } = message;

  return (
    <Card>
      <UserChip userId={creatorId} />
      <p>{createdAt.toLocaleString()}</p>
      <p>{messageText}</p>
    </Card>
  );
};
