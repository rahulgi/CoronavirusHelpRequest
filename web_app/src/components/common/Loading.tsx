import React from "react";
import styled from "@emotion/styled/macro";

const StyledLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * TODO make this nicer.
 */
export const Loading: React.FC = () => {
  return <StyledLoading>Loading...</StyledLoading>;
};
