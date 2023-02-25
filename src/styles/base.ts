import { css } from "styled-components";

import { Theme } from "./theme";
/**
 * BaseProps
 * @description A set of commonly used props that can be used to style any component
 * 
 * @example
 * <Flex c="base" bg="primary" />
 * 
 * @property {"block" | "none"} display
 * @property {keyof Theme["palette"]} c (color)
 * @property {keyof Theme["palette"]} bg (background)
 * @property {keyof Theme["palette"]} border (border-color)
 * @property {number | "round"} radius (border-radius)
 * @property {keyof Theme["fontSize"]} fontSize
 * @property {"bold" | "normal"} fontWeight
 * @property {boolean} shadow (box-shadow)
 * @property {number | "disabled" | "subtle"} opacity

 * @property {string} w - width
 * @property {string} h - height
 * @property {string} minW - min-width
 * @property {string} minH - min-height
 * @property {string} maxW - max-width
 * @property {string} maxH - max-height
 * 
 * @property {number} m (margin)
 * @property {number} mt (margin-top)
 * @property {number} mr (margin-right)
 * @property {number} mb (margin-bottom)
 * @property {number} ml (margin-left)
 * @property {number | "auto"} mx (margin-left & margin-right)
 * @property {number | "auto"} my (margin-top & margin-bottom)
 * 
 * @property {number} p (padding)
 * @property {number} pt (padding-top)
 * @property {number} pr (padding-right)
 * @property {number} pb (padding-bottom)
 * @property {number} pl (padding-left)
 * @property {number} px (padding-left & padding-right)
 * @property {number} py (padding-top & padding-bottom)
 * 
 * @property {"relative" | "absolute" | "fixed"} position
 * @property {number} top
 * @property {number} right
 * @property {number} bottom
 * @property {number} left
 * @property {boolean} posCenter (center absolutely)
 * @property {boolean} posCenterX (center absolutely horizontally)
 * @property {boolean} posCenterY (center absolutely vertically)
 * 
 * @property {boolean} transition
 * 
 * @property {number} zIndex
 * 
 * @property {"pointer" | "default" | "not-allowed" | "auto"} cursor
 */
export interface BaseProps {
  display?: "block" | "none";
  c?: keyof Theme["palette"];
  bg?: keyof Theme["palette"];
  border?: keyof Theme["palette"];
  radius?: number | "round";
  fontSize?: keyof Theme["fontSize"];
  fontWeight?: "bold" | "normal";
  shadow?: boolean;
  opacity?: number | "disabled" | "subtle";

  w?: string;
  h?: string;
  minW?: string;
  minH?: string;
  maxW?: string;
  maxH?: string;

  m?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  mx?: number | "auto";
  my?: number | "auto";

  p?: number;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  px?: number;
  py?: number;

  position?: "relative" | "absolute" | "fixed";
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  posCenter?: boolean;
  posCenterX?: boolean;
  posCenterY?: boolean;

  transition?: boolean;

  zIndex?: number;

  cursor?: "pointer" | "default" | "not-allowed" | "auto";
}

export const baseStyles = css<BaseProps>`
  color: ${({ theme, ...baseProps }) =>
    !!baseProps.c ? `${theme.palette[baseProps.c]} !important` : ""};
  background: ${({ theme, ...baseProps }) =>
    !!baseProps.bg ? `${theme.palette[baseProps.bg]} !important` : ""};
  border: ${({ theme, ...baseProps }) =>
    !!baseProps.border ? `solid 2px ${theme.palette[baseProps.border]}` : ""};
  border-radius: ${({ theme, ...baseProps }) =>
    !!baseProps.radius
      ? baseProps.radius === "round"
        ? "100px"
        : theme.radius * baseProps.radius + "px"
      : ""};
  font-size: ${({ theme, ...baseProps }) =>
    !!baseProps.fontSize ? theme.fontSize[baseProps.fontSize] : ""};
  font-weight: ${({ ...baseProps }) => baseProps.fontWeight || ""};
  box-shadow: ${({ theme, ...baseProps }) =>
    !!baseProps.shadow ? theme.shadow : ""};
  opacity: ${({ theme, ...baseProps }) =>
    baseProps.opacity !== undefined
      ? baseProps.opacity === "disabled" || baseProps.opacity === "subtle"
        ? theme.opacity[baseProps.opacity]
        : baseProps.opacity
      : ""};

  width: ${({ ...baseProps }) => baseProps.w || ""};
  height: ${({ ...baseProps }) => baseProps.h || ""};
  min-width: ${({ ...baseProps }) => baseProps.minW || ""};
  min-height: ${({ ...baseProps }) => baseProps.minH || ""};
  max-width: ${({ ...baseProps }) => baseProps.maxW || ""};
  max-height: ${({ ...baseProps }) => baseProps.maxH || ""};

  margin: ${({ theme, ...baseProps }) =>
    baseProps.m ? theme.spacing * baseProps.m + "px" : ""};
  margin-top: ${({ theme, ...baseProps }) => {
    if (!!baseProps.my) {
      if (baseProps.my === "auto") {
        return "auto";
      }

      return theme.spacing * baseProps.my + "px";
    }

    if (!!baseProps.mt) {
      return theme.spacing * baseProps.mt + "px";
    }
  }};
  margin-right: ${({ theme, ...baseProps }) => {
    if (!!baseProps.mx) {
      if (baseProps.mx === "auto") {
        return "auto";
      }

      return theme.spacing * baseProps.mx + "px";
    }

    if (!!baseProps.mr) {
      return theme.spacing * baseProps.mr + "px";
    }
  }};
  margin-bottom: ${({ theme, ...baseProps }) => {
    if (!!baseProps.my) {
      if (baseProps.my === "auto") {
        return "auto";
      }

      return theme.spacing * baseProps.my + "px";
    }

    if (!!baseProps.mb) {
      return theme.spacing * baseProps.mb + "px";
    }
  }};
  margin-left: ${({ theme, ...baseProps }) => {
    if (!!baseProps.mx) {
      if (baseProps.mx === "auto") {
        return "auto";
      }

      return theme.spacing * baseProps.mx + "px";
    }

    if (!!baseProps.ml) {
      return theme.spacing * baseProps.ml + "px";
    }
  }};

  padding: ${({ theme, ...baseProps }) =>
    !!baseProps.p ? theme.spacing * baseProps.p + "px" : ""};
  padding-top: ${({ theme, ...baseProps }) => {
    if (!!baseProps.py) {
      return theme.spacing * baseProps.py + "px";
    }

    if (!!baseProps.pt) {
      return theme.spacing * baseProps.pt + "px";
    }
  }};
  padding-right: ${({ theme, ...baseProps }) => {
    if (!!baseProps.px) {
      return theme.spacing * baseProps.px + "px";
    }

    if (!!baseProps.pr) {
      return theme.spacing * baseProps.pr + "px";
    }
  }};
  padding-bottom: ${({ theme, ...baseProps }) => {
    if (!!baseProps.py) {
      return theme.spacing * baseProps.py + "px";
    }

    if (!!baseProps.pb) {
      return theme.spacing * baseProps.pb + "px";
    }
  }};
  padding-left: ${({ theme, ...baseProps }) => {
    if (!!baseProps.px) {
      return theme.spacing * baseProps.px + "px";
    }

    if (!!baseProps.pl) {
      return theme.spacing * baseProps.pl + "px";
    }
  }};

  position: ${({ ...baseProps }) => baseProps.position || ""};
  top: ${({ theme, ...baseProps }) => {
    if (baseProps.top !== undefined)
      return theme.spacing * baseProps.top + "px";
    if (!!baseProps.posCenter || !!baseProps.posCenterY) return "50%";
  }};
  right: ${({ theme, ...baseProps }) =>
    baseProps.right !== undefined
      ? theme.spacing * baseProps.right + "px"
      : ""};
  bottom: ${({ theme, ...baseProps }) =>
    baseProps.bottom !== undefined
      ? theme.spacing * baseProps.bottom + "px"
      : ""};
  left: ${({ theme, ...baseProps }) => {
    if (baseProps.left !== undefined)
      return theme.spacing * baseProps.left + "px";
    if (!!baseProps.posCenter || !!baseProps.posCenterX) return "50%";
  }};
  transform: ${({ ...baseProps }) =>
    baseProps.posCenter
      ? "translate(-50%, -50%)"
      : baseProps.posCenterX
      ? "translateX(-50%)"
      : baseProps.posCenterY
      ? "translateY(-50%)"
      : ""};

  transition: ${({ theme, ...baseProps }) =>
    !!baseProps.transition ? `all ${theme.transition}s ease` : ""};

  z-index: ${({ ...baseProps }) =>
    baseProps.zIndex !== undefined ? baseProps.zIndex : ""};

  cursor: ${({ ...baseProps }) =>
    !!baseProps.cursor ? `${baseProps.cursor}` : ""};
`;
