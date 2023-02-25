import styled from "styled-components";

import { fireAnimation } from "../../styles/animation";
import { BaseProps, baseStyles } from "../../styles/base";

export * from "./CloseButton";
export * from "./SettingsButton";
export * from "./WalletButton";

export const Button = styled.button<
  BaseProps & {
    variant?: "success" | "error";
  }
>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 45px;
  color: inherit;
  margin: unset;
  padding: unset;
  background: unset;
  border: unset;
  border-radius: ${({ theme }) => theme.radius}px;
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: bold;
  letter-spacing: 0.25px;
  opacity: ${({ disabled, theme }) => (disabled ? theme.opacity.disabled : 1)};
  transition: all ${({ theme }) => theme.transition}s ease-out;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  * {
    cursor: inherit;
  }
  &:active {
    margin-top: 1px;
    margin-bottom: -1px;
    transition: unset;
  }

  ${baseStyles}
`;

export const PrimaryButton = styled(Button)`
  margin: unset !important;
  padding: ${({ theme }) => theme.spacing * 1.5}px;
  color: ${({ theme }) =>
    theme.palette[theme.mode === "dark" ? "base" : "text"]};
  font-size: ${({ theme }) => theme.fontSize.lg};
  border-radius: ${({ theme }) => theme.radius * 10}px;
  transition: all ${({ theme }) => theme.transition / 2}s ease-out;
  overflow: hidden;
  * {
    fill: inherit;
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 150%;
    height: 100%;
    background: ${({ theme }) => theme.palette.gradient};
    opacity: 0;
    transition: inherit;
    z-index: -1;
  }

  ${({ disabled }) => {
    if (disabled) return "";

    return `
      &:hover {
        margin: unset !important;
        transform: scale(1.01);

        &::before {
          width: 100%;
          height: 100%;
          opacity: 1;
        }
      }
      &:active {
        margin: unset !important;
        transform: scale(0.995);
      }
    `;
  }}

  ${fireAnimation};
`;

export const GhostButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing}px;
  background: unset;
  border-radius: ${({ theme }) => theme.radius / 1.35}px;

  ${({ disabled, variant, theme }) => {
    if (disabled) return "";

    return `
      &:hover {
        background: ${theme.palette[variant || "contrast"]};
      }
    `;
  }}
`;

export const IconButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing / 1.5}px;
  margin: 0 ${({ theme }) => theme.spacing / 2}px;
  background: ${({ variant, theme, ...baseProps }) =>
    theme.palette[variant || baseProps.bg || "contrast"]};
  border-radius: ${({ theme }) => theme.radius / 1.35}px;
`;

export const LinkButton = styled(Button)`
  color: ${({ variant, theme }) =>
    theme.palette[
      variant || (theme.mode === "dark" ? "secondary" : "primary")
    ]};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
