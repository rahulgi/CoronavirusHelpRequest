import css from "@emotion/css/macro";
import { materialTextStyles } from "./materialTypography";

export const textStyles = css`
  ${materialTextStyles}

  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
  }
`;
