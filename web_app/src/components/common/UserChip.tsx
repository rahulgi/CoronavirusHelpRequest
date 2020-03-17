import React from "react";
import styled from "@emotion/styled/macro";
import { useUser } from "../../hooks/data/useUser";
import { Avatar } from "./Avatar";
import { FetchResultStatus } from "../../hooks/data";
import { getDisplayNameOrDefault } from "../../hooks/data/useUser";
import { spacing } from "../../styles/spacing";
import { useCurrentUserId } from "../contexts/AuthContext";

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  & > *:not(:last-child) {
    margin-right: ${spacing.s};
  }
`;

export const UserChip: React.FC<{ userId: string }> = ({ userId }) => {
  const userResult = useUser(userId);
  const currentUserId = useCurrentUserId();
  const isSelf =
    userResult.status === FetchResultStatus.FOUND &&
    userResult.result.id === currentUserId;
  return (
    <Chip>
      <Avatar
        profileUrl={
          userResult.status === FetchResultStatus.FOUND
            ? userResult.result.profileUrl
            : undefined
        }
      />
      <span className="mdc-typography mdc-typography--overline">
        {getDisplayNameOrDefault(userResult)} {isSelf && "(You)"}
      </span>
    </Chip>
  );
};
