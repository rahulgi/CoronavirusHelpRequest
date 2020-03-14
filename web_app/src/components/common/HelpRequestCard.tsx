import React from "react";
import { HelpRequestStatus } from "../../firebase/storage";

export interface HelpRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  body: string;
  status: HelpRequestStatus;
}

export const HelpRequestCard: React.FC<{ request: HelpRequest }> = ({
  request
}) => {
  const { createdAt, title, body, status } = request;
  return (
    <div>
      <h3>{title}</h3>
      <p>Created at: {createdAt.toLocaleString()}</p>
      <p>Status: {status}</p>
      <p>{body}</p>
    </div>
  );
};
