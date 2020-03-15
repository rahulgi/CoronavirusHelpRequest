import React from "react";
import styled from "@emotion/styled/macro";

const StyledNotFound = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * TODO make this nicer.
 */
export const NotFound: React.FC<{ elementName: string }> = ({
  elementName
}) => {
  return (
    <StyledNotFound>
      <h4>{elementName} not found</h4>
    </StyledNotFound>
  );
};
