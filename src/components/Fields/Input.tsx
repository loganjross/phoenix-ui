import { useState } from "react";
import styled from "styled-components";

import { BaseProps, baseStyles } from "../../styles/base";
import { Flex } from "../Layout";
import { Button } from "../Buttons";
import { Icon } from "../Icons";
import { FieldProps, FieldContainer, FieldLabel } from ".";

interface InputProps extends Omit<FieldProps, "value" | "onChange"> {
  value: string;
  type?: "text" | "number";
  max?: number;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  onClick?: () => void;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onPressEnter?: () => void;
}

export const StyledInput = styled.input<BaseProps>`
  border: unset;
  color: inherit;
  background: unset;
  ::placeholder {
    opacity: ${({ theme }) => theme.opacity.subtle};
  }

  ${baseStyles}
`;

export function Input({
  type,
  value,
  label,
  placeholder,
  max,
  leftElement,
  rightElement,
  onClick,
  onChange,
  onBlur,
  onPressEnter,
  error,
  disabled,
  ...baseProps
}: InputProps & BaseProps) {
  const [isFocused, setIsFocused] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    let input = e.target.value;
    if (type === "number") {
      while (!input.includes(".") && input.length > 1 && input[0] === "0") {
        input = input.substring(1);
      }
      if (isNaN(+input) || +input < 0 || +input > Number.MAX_SAFE_INTEGER) {
        input = "";
      }
    }

    onChange(input);
  }

  function handleBlur() {
    setIsFocused(false);
    if (type === "number" && !!max) {
      const minInput = Math.min(+value, max);
      onChange(minInput > 0 ? minInput.toString() : "");
    }

    if (onBlur) onBlur();
  }

  function handlePressEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && onPressEnter) {
      e.preventDefault();
      onPressEnter();
    }
  }

  return (
    <FieldContainer
      position="relative"
      border={isFocused && !error ? "primary" : undefined}
      column
      label={label}
      error={!!error}
      disabled={disabled}
      onClick={onClick}
      {...baseProps}
    >
      {!!label && <FieldLabel>{label}</FieldLabel>}
      <Flex w="100%" h="100%" centered>
        {!!leftElement && (
          <Flex py={1 / 2} pl={1} pr={1 / 2}>
            {leftElement}
          </Flex>
        )}
        <StyledInput
          w="100%"
          h="100%"
          py={1}
          pr={!!rightElement ? undefined : max !== undefined ? 1 / 2 : 1.5}
          pl={!!leftElement ? undefined : 1.5}
          fontWeight={type === "number" ? "bold" : undefined}
          fontSize={type === "number" ? "lg" : undefined}
          cursor={disabled ? "not-allowed" : "auto"}
          value={value}
          placeholder={placeholder}
          onChange={handleInput}
          onBlur={handleBlur}
          onKeyDown={handlePressEnter}
          disabled={disabled}
          style={{ textAlign: type === "number" ? "right" : "left" }}
          onFocus={() => setIsFocused(true)}
        />
        <Flex p={1 / 2} pr={1}>
          {rightElement}
          {!rightElement && type === "number" && max !== undefined && (
            <Button
              p={1 / 2}
              c={max > 0 && +value === max ? "primary" : undefined}
              radius={1 / 2}
              fontSize="xs"
              opacity={max > 0 && +value === max ? 1 : "disabled"}
              onClick={() => onChange(max.toString())}
              disabled={disabled}
            >
              MAX
            </Button>
          )}
        </Flex>
      </Flex>
      {typeof error === "string" && !!error.length && (
        <Flex
          position="absolute"
          left={0}
          bottom={-2.25}
          c="error"
          fontSize="sm"
        >
          <Icon mr={1 / 4} name="alert-circle-outline" />
          {error}
        </Flex>
      )}
    </FieldContainer>
  );
}
