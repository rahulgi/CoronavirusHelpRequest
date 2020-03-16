import { injectGlobal } from "emotion/macro";
import { textStyles } from "./text";

export const injectGlobalStyles = () => injectGlobal`
  html,
  body,
  #reactRoot {
    min-height: 100vh;  /* minimum full page screen */
  }

  ${textStyles};
`;
