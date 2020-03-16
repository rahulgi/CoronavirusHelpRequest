import React from "react";
import styled from "@emotion/styled/macro";
import { spacing } from "../../../styles/spacing";

export const Card: React.FC = ({ children }) => {
  return <div className="mdc-card">{children}</div>;
};

const StyledPrimaryAction = styled.div`
  padding: ${spacing.m};
`;

export const CardPrimaryAction: React.FC = ({ children }) => {
  return (
    <StyledPrimaryAction className="mdc-card__primary-action">
      {children}
    </StyledPrimaryAction>
  );
};

export const CardOverline: React.FC = ({ children }) => {
  return (
    <div className="mdc-typography mdc-typography--overline">{children}</div>
  );
};

export const CardTitle: React.FC = ({ children }) => {
  return (
    <div className="mdc-typography mdc-typography--headline6">{children}</div>
  );
};

const StyledCardSubtitle = styled.div`
  display: flex;
  align-items: center;
  & > *:not(:last-child) {
    margin-right: ${spacing.s};
  }
`;

export const CardSubtitle: React.FC = ({ children }) => {
  return (
    <StyledCardSubtitle className="mdc-typography mdc-typography--subtitle2">
      {children}
    </StyledCardSubtitle>
  );
};

export const CardBodyText: React.FC = ({ children }) => {
  return <div className="mdc-typography mdc-typography--body2">{children}</div>;
};

export const CardActions: React.FC = ({ children }) => {
  return <div className="mdc-card__actions">{children}</div>;
};

export const CardActionButtons: React.FC = ({ children }) => {
  return <div className="mdc-card__action-buttons">{children}</div>;
};
