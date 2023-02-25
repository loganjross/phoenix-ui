import { BaseProps } from "../../styles/base";
import { Flex } from "../Layout";
import { Button } from "../Buttons";
import { useTheme } from "styled-components";

export interface ToggleOption {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function Toggle({
  size,
  options,
  ...baseProps
}: BaseProps & {
  size?: "sm" | "lg";
  options: [ToggleOption, ToggleOption];
}) {
  const theme = useTheme();

  return (
    <Flex position="relative" bg="contrast" radius={2 / 3} {...baseProps}>
      {options.map((option, i) => (
        <Flex
          key={i}
          w="50%"
          p={size === "sm" ? 1.5 : 2}
          py={size === "sm" ? 1 : 1.5}
          c={option.isActive && theme.mode === "dark" ? "base" : undefined}
          opacity={option.isActive ? 1 : "disabled"}
          zIndex={1}
          centered
        >
          <Button
            fontSize={size === "sm" ? "xs" : undefined}
            onClick={option.onClick}
          >
            {option.label}
          </Button>
        </Flex>
      ))}
      <Flex
        position="absolute"
        w="44%"
        h="70%"
        bg="primary"
        radius={2 / 5}
        transition
        style={{
          top: "15%",
          left: options[0].isActive ? "4%" : "52%",
        }}
      />
    </Flex>
  );
}
