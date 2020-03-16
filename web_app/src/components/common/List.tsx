import styled from "@emotion/styled/macro";

import { spacing } from "../../styles/spacing";

export const List = styled.ul`
  list-style-type: none;
  padding: 0;

  & > *:not(:last-child) {
    margin-bottom: ${spacing.m};
  }
`;
