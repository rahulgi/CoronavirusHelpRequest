import React from "react";
import styled from "@emotion/styled/macro";
import { Link } from "react-router-dom";

import { HelpRequestStatus } from "../../firebase/storage";
import { spacing } from "../helpers/styles";

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: inherit;
`;

const Card = styled.div`
  border-radius: 16px;
  background-color: #e8e8e8;
  padding: ${spacing.s};
`;

export interface HelpRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  body: string;
  status: HelpRequestStatus;
}

interface HelpRequestCardProps {
  request: HelpRequest;
  isLink?: boolean;
}

export const HelpRequestCard: React.FC<HelpRequestCardProps> = ({
  request,
  isLink = false
}) => {
  const { id, createdAt, title, body, status } = request;

  const cardContents = (
    <Card>
      <h3>{title}</h3>
      <p>Created at: {createdAt.toLocaleString()}</p>
      <p>Status: {status}</p>
      <p>{body}</p>
    </Card>
  );

  return isLink ? (
    <StyledLink to={`/request/${id}`}>{cardContents}</StyledLink>
  ) : (
    cardContents
  );
};
