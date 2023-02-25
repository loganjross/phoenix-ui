import { useState } from "react";

import { BaseProps } from "../../styles/base";
import { FieldProps, FieldContainer, FieldLabel } from ".";
import { Flex } from "../Layout";
import { Text } from "../Typography";
import { Icon } from "../Icons";

export type OptionKey = string | number;

export interface SelectOption {
  key: OptionKey;
  label: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

interface SelectProps extends Omit<FieldProps, "value" | "onChange"> {
  value: OptionKey | null;
  options: Array<SelectOption>;
  emptyMessage?: string;
  onChange: (key: OptionKey) => void;
}

export function Select({
  label,
  placeholder,
  options,
  value,
  emptyMessage,
  onChange,
  error,
  disabled,
  ...fieldProps
}: SelectProps) {
  const [areOptionsOpen, setAreOptionsOpen] = useState(false);
  const currentOption = options.find((option) => option.key === value) || null;

  return (
    <FieldContainer
      position="relative"
      w={fieldProps.w}
      column
      label={label}
      error={!!error}
      onClick={() => (disabled ? null : setAreOptionsOpen(!areOptionsOpen))}
      disabled={disabled}
      onMouseLeave={() => setAreOptionsOpen(false)}
    >
      {!!label && <FieldLabel>{label}</FieldLabel>}
      <Option
        key={currentOption?.key || "placeholder"}
        bg={undefined}
        label={currentOption?.label || placeholder || ""}
        leftElement={currentOption?.leftElement}
        rightElement={<Icon name="chevron-down" fontSize="base" />}
        isActive
        disabled={disabled}
      />
      <Flex
        position="absolute"
        left={0}
        w="auto"
        minW="100%"
        h="auto"
        maxH="200px"
        column
        p={1 / 2}
        bg="accent"
        radius={1}
        shadow
        opacity={areOptionsOpen ? 1 : 0}
        overflowY="auto"
        transition
        zIndex={areOptionsOpen ? 100 : -100}
        style={{
          top: `calc(100% + ${areOptionsOpen ? 2 : 9}px)`,
          transitionTimingFunction: "ease-in",
          pointerEvents: areOptionsOpen ? "all" : "none",
        }}
      >
        {!!options.length ? (
          options.map((option) => (
            <Flex
              key={option.key}
              w="100%"
              onClick={() => onChange(option.key)}
            >
              <Option {...option} isActive={value === option.key} />
            </Flex>
          ))
        ) : (
          <Flex py={1 / 2} px={1}>
            <Text fontSize="sm">{emptyMessage || "N/A"}</Text>
          </Flex>
        )}
      </Flex>
      {typeof error === "string" && (
        <Text c="error" fontSize="sm">
          {error}
        </Text>
      )}
    </FieldContainer>
  );
}

function Option({
  label,
  leftElement,
  rightElement,
  isActive,
  disabled,
  ...baseProps
}: SelectOption &
  BaseProps & {
    isActive?: boolean;
    disabled?: boolean;
  }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Flex
      w="auto"
      minW="100%"
      minH="40px"
      my={isActive ? 0 : 0.2}
      py={1 / 2}
      px={1}
      bg={isHovered || isActive ? "contrast" : undefined}
      radius={3 / 4}
      cursor={disabled ? "not-allowed" : "pointer"}
      align="center"
      justify="space-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...baseProps}
    >
      <Flex w="100%" align="center" justify="flex-start">
        {!!leftElement && <Flex mr={1 / 2}>{leftElement}</Flex>}
        <Text
          w="100%"
          fontWeight="bold"
          fontSize="sm"
          style={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {label}
        </Text>
      </Flex>
      {!!rightElement && (
        <Flex pl={1} style={{ textAlign: "right" }}>
          {rightElement}
        </Flex>
      )}
    </Flex>
  );
}
