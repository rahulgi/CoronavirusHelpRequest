import React from "react";
import styled from "@emotion/styled/macro";

const StyledError = styled.div`
  color: red;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Error: React.FC = ({ children }) => {
  return <StyledError>{children}</StyledError>;
};
