import styled from "styled-components";

import { BaseProps, baseStyles } from "../../styles/base";

export const Text = styled.p<BaseProps & { variant?: "header" | "label" }>`
  font-family: inherit;
  font-size: ${({ variant, theme }) =>
    variant === "header"
      ? theme.fontSize.lg
      : variant === "label"
      ? theme.fontSize.xs
      : theme.fontSize.base};
  font-weight: ${({ variant }) =>
    variant === "header" || variant === "label" ? "bold" : ""};
  line-height: ${({ variant, theme }) =>
    variant === "header" ? theme.fontSize.xl : theme.fontSize.lg};
  letter-spacing: ${({ variant }) => (variant === "header" ? "0.25px" : "")};
  margin-bottom: ${({ variant, theme }) =>
    variant === "header" ? theme.spacing * 1.5 : "0"}px;
  opacity: ${({ variant, theme }) =>
    variant === "label" ? theme.opacity.disabled : 1};
  text-transform: ${({ variant }) => (variant === "label" ? "uppercase" : "")};

  ${baseStyles}
`;
