import React from "react";

import { Message } from "../firebase/storage/messaging";
import { Card } from "./common/Card";

interface MessageCardProps {
  message: Message;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  const { createdAt, message: messageText } = message;

  return (
    <Card>
      <p>{createdAt.toLocaleString()}</p>
      <p>{messageText}</p>
    </Card>
  );
};
