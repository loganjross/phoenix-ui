import styled from "styled-components";

import { BaseProps, baseStyles } from "../../styles/base";
import { Flex } from "../Layout";
import { Text } from "../Typography";
import { SelectOption } from "./Select";

export * from "./Input";
export * from "./Select";
export * from "./Switch";
export * from "./Toggle";
export * from "./QueryDatePicker";

export interface FieldProps extends BaseProps {
  value?: string | boolean | SelectOption;
  label?: string;
  placeholder?: string;
  error?: string | boolean;
  disabled?: boolean;
  onChange?: (value: string | boolean | SelectOption) => void;
}

export const FieldLabel = styled(Text)`
  opacity: ${({ theme }) => theme.opacity.disabled};
  font-size: ${({ theme }) => theme.fontSize.xs};
  margin: ${({ theme }) => theme.spacing / 1}px
    ${({ theme }) => theme.spacing * 1.5}px -6px;
`;

export const FieldContainer = styled(Flex)<FieldProps>`
  position: relative;
  width: 100%;
  height: ${({ label }) => (!!label ? "62px" : "auto")};
  margin: ${({ theme }) => theme.spacing / 2}px 0;
  background: ${({ theme }) => theme.palette.contrast};
  border-radius: ${({ theme }) => theme.radius}px;
  border: 2px solid
    ${({ error, theme }) => (error ? theme.palette.error : "transparent")};
  transition: all ${({ theme }) => theme.transition}s ease;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "")};

  ${baseStyles}
`;
