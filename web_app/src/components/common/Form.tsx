import styled from "@emotion/styled/macro";

import { spacing } from "../helpers/styles";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 600px;

  & > div {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  & > *:not(:last-child) {
    margin-bottom: ${spacing.m};
  }
`;
