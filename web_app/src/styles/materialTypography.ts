import css from "@emotion/css/macro";

/**
 * Imports some Material Design styles from
 * https://unpkg.com/material-components-web@5.1.0/dist/material-components-web.css
 * and applies them to base html elements so I don't have to apply the class
 * every time I want to use the style. Also updates the header font to Open Sanbs,.
 */
export const materialTextStyles = css`
  :root {
    --mdc-typography-headline1-font-family: "Open Sans";
    --mdc-typography-headline2-font-family: "Open Sans";
    --mdc-typography-headline3-font-family: "Open Sans";
    --mdc-typography-headline4-font-family: "Open Sans";
    --mdc-typography-headline5-font-family: "Open Sans";
    --mdc-typography-headline6-font-family: "Open Sans";
    --mdc-typography-subtitle1-font-family: "Open Sans";
    --mdc-typography-subtitle2-font-family: "Open Sans";
  }

  body {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: Roboto, sans-serif;
    /* @alternate */
    font-family: var(--mdc-typography-font-family, Roboto, sans-serif);
  }

  h1 {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: Roboto, sans-serif;
    /* @alternate */
    font-family: var(
      --mdc-typography-headline1-font-family,
      var(--mdc-typography-font-family, Roboto, sans-serif)
    );
    font-size: 6rem;
    /* @alternate */
    font-size: var(--mdc-typography-headline1-font-size, 6rem);
    line-height: 6rem;
    /* @alternate */
    line-height: var(--mdc-typography-headline1-line-height, 6rem);
    font-weight: 300;
    /* @alternate */
    font-weight: var(--mdc-typography-headline1-font-weight, 300);
    letter-spacing: -0.015625em;
    /* @alternate */
    letter-spacing: var(--mdc-typography-headline1-letter-spacing, -0.015625em);
    text-decoration: inherit;
    /* @alternate */
    -webkit-text-decoration: var(
      --mdc-typography-headline1-text-decoration,
      inherit
    );
    text-decoration: var(--mdc-typography-headline1-text-decoration, inherit);
    text-transform: inherit;
    /* @alternate */
    text-transform: var(--mdc-typography-headline1-text-transform, inherit);
  }

  h2 {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: Roboto, sans-serif;
    /* @alternate */
    font-family: var(
      --mdc-typography-headline2-font-family,
      var(--mdc-typography-font-family, Roboto, sans-serif)
    );
    font-size: 3.75rem;
    /* @alternate */
    font-size: var(--mdc-typography-headline2-font-size, 3.75rem);
    line-height: 3.75rem;
    /* @alternate */
    line-height: var(--mdc-typography-headline2-line-height, 3.75rem);
    font-weight: 300;
    /* @alternate */
    font-weight: var(--mdc-typography-headline2-font-weight, 300);
    letter-spacing: -0.0083333333em;
    /* @alternate */
    letter-spacing: var(
      --mdc-typography-headline2-letter-spacing,
      -0.0083333333em
    );
    text-decoration: inherit;
    /* @alternate */
    -webkit-text-decoration: var(
      --mdc-typography-headline2-text-decoration,
      inherit
    );
    text-decoration: var(--mdc-typography-headline2-text-decoration, inherit);
    text-transform: inherit;
    /* @alternate */
    text-transform: var(--mdc-typography-headline2-text-transform, inherit);
  }

  h3 {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: Roboto, sans-serif;
    /* @alternate */
    font-family: var(
      --mdc-typography-headline3-font-family,
      var(--mdc-typography-font-family, Roboto, sans-serif)
    );
    font-size: 3rem;
    /* @alternate */
    font-size: var(--mdc-typography-headline3-font-size, 3rem);
    line-height: 3.125rem;
    /* @alternate */
    line-height: var(--mdc-typography-headline3-line-height, 3.125rem);
    font-weight: 400;
    /* @alternate */
    font-weight: var(--mdc-typography-headline3-font-weight, 400);
    letter-spacing: normal;
    /* @alternate */
    letter-spacing: var(--mdc-typography-headline3-letter-spacing, normal);
    text-decoration: inherit;
    /* @alternate */
    -webkit-text-decoration: var(
      --mdc-typography-headline3-text-decoration,
      inherit
    );
    text-decoration: var(--mdc-typography-headline3-text-decoration, inherit);
    text-transform: inherit;
    /* @alternate */
    text-transform: var(--mdc-typography-headline3-text-transform, inherit);
  }

  h4 {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: Roboto, sans-serif;
    /* @alternate */
    font-family: var(
      --mdc-typography-headline4-font-family,
      var(--mdc-typography-font-family, Roboto, sans-serif)
    );
    font-size: 2.125rem;
    /* @alternate */
    font-size: var(--mdc-typography-headline4-font-size, 2.125rem);
    line-height: 2.5rem;
    /* @alternate */
    line-height: var(--mdc-typography-headline4-line-height, 2.5rem);
    font-weight: 400;
    /* @alternate */
    font-weight: var(--mdc-typography-headline4-font-weight, 400);
    letter-spacing: 0.0073529412em;
    /* @alternate */
    letter-spacing: var(
      --mdc-typography-headline4-letter-spacing,
      0.0073529412em
    );
    text-decoration: inherit;
    /* @alternate */
    -webkit-text-decoration: var(
      --mdc-typography-headline4-text-decoration,
      inherit
    );
    text-decoration: var(--mdc-typography-headline4-text-decoration, inherit);
    text-transform: inherit;
    /* @alternate */
    text-transform: var(--mdc-typography-headline4-text-transform, inherit);
  }

  h5 {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: Roboto, sans-serif;
    /* @alternate */
    font-family: var(
      --mdc-typography-headline5-font-family,
      var(--mdc-typography-font-family, Roboto, sans-serif)
    );
    font-size: 1.5rem;
    /* @alternate */
    font-size: var(--mdc-typography-headline5-font-size, 1.5rem);
    line-height: 2rem;
    /* @alternate */
    line-height: var(--mdc-typography-headline5-line-height, 2rem);
    font-weight: 400;
    /* @alternate */
    font-weight: var(--mdc-typography-headline5-font-weight, 400);
    letter-spacing: normal;
    /* @alternate */
    letter-spacing: var(--mdc-typography-headline5-letter-spacing, normal);
    text-decoration: inherit;
    /* @alternate */
    -webkit-text-decoration: var(
      --mdc-typography-headline5-text-decoration,
      inherit
    );
    text-decoration: var(--mdc-typography-headline5-text-decoration, inherit);
    text-transform: inherit;
    /* @alternate */
    text-transform: var(--mdc-typography-headline5-text-transform, inherit);
  }

  h6 {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: Roboto, sans-serif;
    /* @alternate */
    font-family: var(
      --mdc-typography-headline6-font-family,
      var(--mdc-typography-font-family, Roboto, sans-serif)
    );
    font-size: 1.25rem;
    /* @alternate */
    font-size: var(--mdc-typography-headline6-font-size, 1.25rem);
    line-height: 2rem;
    /* @alternate */
    line-height: var(--mdc-typography-headline6-line-height, 2rem);
    font-weight: 500;
    /* @alternate */
    font-weight: var(--mdc-typography-headline6-font-weight, 500);
    letter-spacing: 0.0125em;
    /* @alternate */
    letter-spacing: var(--mdc-typography-headline6-letter-spacing, 0.0125em);
    text-decoration: inherit;
    /* @alternate */
    -webkit-text-decoration: var(
      --mdc-typography-headline6-text-decoration,
      inherit
    );
    text-decoration: var(--mdc-typography-headline6-text-decoration, inherit);
    text-transform: inherit;
    /* @alternate */
    text-transform: var(--mdc-typography-headline6-text-transform, inherit);
  }

  .subtitle {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: Roboto, sans-serif;
    /* @alternate */
    font-family: var(
      --mdc-typography-subtitle1-font-family,
      var(--mdc-typography-font-family, Roboto, sans-serif)
    );
    font-size: 1rem;
    /* @alternate */
    font-size: var(--mdc-typography-subtitle1-font-size, 1rem);
    line-height: 1.75rem;
    /* @alternate */
    line-height: var(--mdc-typography-subtitle1-line-height, 1.75rem);
    font-weight: 400;
    /* @alternate */
    font-weight: var(--mdc-typography-subtitle1-font-weight, 400);
    letter-spacing: 0.009375em;
    /* @alternate */
    letter-spacing: var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);
    text-decoration: inherit;
    /* @alternate */
    -webkit-text-decoration: var(
      --mdc-typography-subtitle1-text-decoration,
      inherit
    );
    text-decoration: var(--mdc-typography-subtitle1-text-decoration, inherit);
    text-transform: inherit;
    /* @alternate */
    text-transform: var(--mdc-typography-subtitle1-text-transform, inherit);
  }

  p {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: Roboto, sans-serif;
    /* @alternate */
    font-family: var(
      --mdc-typography-body1-font-family,
      var(--mdc-typography-font-family, Roboto, sans-serif)
    );
    font-size: 1rem;
    /* @alternate */
    font-size: var(--mdc-typography-body1-font-size, 1rem);
    line-height: 1.5rem;
    /* @alternate */
    line-height: var(--mdc-typography-body1-line-height, 1.5rem);
    font-weight: 400;
    /* @alternate */
    font-weight: var(--mdc-typography-body1-font-weight, 400);
    letter-spacing: 0.03125em;
    /* @alternate */
    letter-spacing: var(--mdc-typography-body1-letter-spacing, 0.03125em);
    text-decoration: inherit;
    /* @alternate */
    -webkit-text-decoration: var(
      --mdc-typography-body1-text-decoration,
      inherit
    );
    text-decoration: var(--mdc-typography-body1-text-decoration, inherit);
    text-transform: inherit;
    /* @alternate */
    text-transform: var(--mdc-typography-body1-text-transform, inherit);
  }

  button {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: Roboto, sans-serif;
    /* @alternate */
    font-family: var(
      --mdc-typography-button-font-family,
      var(--mdc-typography-font-family, Roboto, sans-serif)
    );
    font-size: 0.875rem;
    /* @alternate */
    font-size: var(--mdc-typography-button-font-size, 0.875rem);
    line-height: 2.25rem;
    /* @alternate */
    line-height: var(--mdc-typography-button-line-height, 2.25rem);
    font-weight: 500;
    /* @alternate */
    font-weight: var(--mdc-typography-button-font-weight, 500);
    letter-spacing: 0.0892857143em;
    /* @alternate */
    letter-spacing: var(--mdc-typography-button-letter-spacing, 0.0892857143em);
    text-decoration: none;
    /* @alternate */
    -webkit-text-decoration: var(--mdc-typography-button-text-decoration, none);
    text-decoration: var(--mdc-typography-button-text-decoration, none);
    text-transform: uppercase;
    /* @alternate */
    text-transform: var(--mdc-typography-button-text-transform, uppercase);
  }
`;
