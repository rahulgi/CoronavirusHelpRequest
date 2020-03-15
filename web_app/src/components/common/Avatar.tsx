import React from "react";
import styled from "@emotion/styled/macro";

const AvatarContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const AvatarImg = styled.img`
  height: 24px;
  width: 24px;
  object-fit: cover;
  border-radius: 48px;
  border: solid 1px #c8c8c8;
  background-color: #f8f8f8;
`;

export const Avatar: React.FC<{ profileUrl?: string }> = ({ profileUrl }) => {
  return (
    <AvatarContainer>
      <AvatarImg src={profileUrl} />
    </AvatarContainer>
  );
};
