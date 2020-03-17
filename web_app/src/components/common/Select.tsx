/**
 * Source: Every.org codebase. Used with permission by Rahul Gupta-Iwasaki.
 *
 * A Dropdown component that renders a custom component on devices with mouse
 * input and the default html Select element for devices with touch as the
 * primary input. For such devices, the default OS Select interface is probably
 * better.
 */
import styled from "@emotion/styled/macro";
import React from "react";
import ReactDropdown, { Option as ReactDropdownOption } from "react-dropdown";

import "react-dropdown/style.css";

import { InputContainerProps, InputContainer } from "./InputContainer";
import { spacing } from "../../styles/spacing";
import { PALETTE } from "../../styles/colors";
import { materialParagraphStyle } from "../../styles/materialTypography";

export type Option = ReactDropdownOption;

const SelectComponent = styled(ReactDropdown)`
  .Dropdown-control {
    border: 1px solid transparent;

    padding: ${spacing.xs};

    background: ${PALETTE.background};
  }

  &.is-open .Dropdown-control {
    border-radius: 4px 4px 0 0;

    background: ${PALETTE.background};
  }

  .Dropdown-menu {
    background: ${PALETTE.background};

    padding-top: ${spacing.s};
    padding-bottom: ${spacing.s};

    border: 1px solid transparent;
    border-radius: 0 0 4px 4px;
  }

  .Dropdown-option {
    &:hover {
      background: ${PALETTE.darkGray};
    }

    &.is-selected {
      background-color: inherit;

      &:hover {
        background: ${PALETTE.darkGray};
      }
    }
  }

  & .Dropdown-arrow {
    top: 0.75em;
  }
`;

const NativeSelect = styled.select`
  appearance: none;
  outline: none;
  border: 1px solid transparent;
  border-radius: 4px;
  background: ${PALETTE.background};
  padding: ${spacing.xs};
  ${materialParagraphStyle}

  &:focus {
    outline: none;
    background: ${PALETTE.darkGray};
  }
`;

interface Props {
  className?: string;
  options: Option[];
  value: string;
  onChange: (arg: Option) => void;
  placeholder?: string;
}

export const Select: React.FC<Props & InputContainerProps> = ({
  options,
  onChange,
  value,
  className,
  labelText,
  description,
  ...rest
}) => {
  const isCoarsePointer: boolean = matchMedia("(pointer: coarse)").matches;
  const select = isCoarsePointer ? (
    <NativeSelect
      className={className}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = options.find(({ value }) => value === e.target.value);
        selected && onChange(selected);
      }}
    >
      {options.map(({ value, label }) => (
        <option value={value} key={value}>
          {label}
        </option>
      ))}
    </NativeSelect>
  ) : (
    <SelectComponent
      className={className}
      options={options}
      onChange={onChange}
      value={value}
    />
  );

  return (
    <InputContainer labelText={labelText} description={description} {...rest}>
      {select}
    </InputContainer>
  );
};
