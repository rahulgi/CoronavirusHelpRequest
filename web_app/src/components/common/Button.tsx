import React from "react";

export enum ButtonType {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY"
}

const ButtonTypeToMaterialClassName: { [key in ButtonType]: string } = {
  [ButtonType.PRIMARY]: "mdc-button--raised",
  [ButtonType.SECONDARY]: "mdc-button--outlined"
};

type ButtonProps = {
  type: ButtonType;
} & React.HTMLProps<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({ type, children, ...rest }) => {
  return (
    <button
      className={`mdc-button ${ButtonTypeToMaterialClassName[type]}`}
      {...rest}
    >
      <span className="mdc-button__ripple"></span>
      {children}
    </button>
  );
};
