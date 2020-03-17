/**
 * Source: Every.org codebase. Used with permission by Rahul Gupta-Iwasaki.
 */

import styled from "@emotion/styled/macro";
import React from "react";

import { materialParagraphStyle } from "../../styles/materialTypography";
import { spacing } from "../../styles/spacing";
import { PALETTE } from "../../styles/colors";

const Description = styled.span<{ validationSuccess?: boolean }>`
  ${materialParagraphStyle};
  min-height: 1.5rem;
  color: ${({ validationSuccess }) =>
    validationSuccess === undefined
      ? PALETTE.onSecondary
      : validationSuccess
      ? PALETTE.primary
      : PALETTE.error};
`;

const LabelText = styled.label`
  font-weight: 500;
`;

const InputContainerComponent = styled.div`
  display: flex;
  flex-direction: column;

  ${LabelText} {
    margin-bottom: ${spacing.s};
  }

  ${Description} {
    margin-top: ${spacing.xs};
  }
`;

export interface InputContainerProps {
  name?: string;

  /**
   * If present, labels the text input
   */
  labelText?: string;

  /**
   * If present, renders a description of what the input is about
   */
  description?: string;

  /**
   * If present, indicates results from validating the input value
   */
  validationStatus?:
    | {
        success: true;
        message?: string;
      }
    | {
        success: false;
        message: string;
      };

  /**
   * Whether or not the component should leave space for the description or
   * error field
   *
   * - This is useful to prevent TextInputs without descriptions from changing
   *   sizes when validation errors appear
   *
   * @default false
   */
  collapseDescriptionSpace?: boolean;
}

export const InputContainer: React.FC<InputContainerProps &
  React.HTMLProps<HTMLDivElement>> = ({
  className,
  name,
  labelText,
  description,
  validationStatus,
  collapseDescriptionSpace = false,
  children,
  ...rest
}) => {
  return (
    <InputContainerComponent className={className}>
      {labelText && <LabelText htmlFor={name}>{labelText}</LabelText>}
      {children}
      {(description ||
        validationStatus?.message ||
        !collapseDescriptionSpace) && (
        <Description validationSuccess={validationStatus?.success}>
          {validationStatus?.message ? validationStatus.message : description}
        </Description>
      )}
    </InputContainerComponent>
  );
};
