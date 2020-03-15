import styled from "@emotion/styled/macro";

import { spacing } from "../helpers/styles";

export const List = styled.ul`
  list-style-type: none;

  & > *:not(:last-child) {
    margin-bottom: ${spacing.m};
  }
`;
