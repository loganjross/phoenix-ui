import { ThemeMode } from "./theme";

/**
 * ColorPalette
 * @description This is the main object that is used to track all colors in the app.
 *
 * @property {string} base
 * @property {string} text
 * @property {string} accent
 * @property {string} contrast
 * @property {string} primary
 * @property {string} secondary
 * @property {string} modal
 * @property {string} error
 * @property {string} success
 * @property {string} gradient
 */
export interface ColorPalette {
  base: string;
  text: string;
  accent: string;
  contrast: string;
  modal: string;
  primary: string;
  secondary: string;
  error: string;
  success: string;
  gradient: string;
}

const lightThemePalette: ColorPalette = {
  base: "#f2f4f6",
  text: "#000000",
  accent: "#c0c0c0",
  contrast: "rgba(0, 0, 0, 0.04)",
  modal: "rgba(0, 0, 0, 0.4)",
  primary: "#ffcc4c",
  secondary: "#f3900d",
  error: "#fa1c0c",
  success: "#17bd08",
  get gradient() {
    return `linear-gradient(100deg, ${this.secondary} 0%, ${this.primary} 80%)`;
  },
};

const darkThemePalette: ColorPalette = {
  ...lightThemePalette,
  base: "#303034",
  text: "#ffffff",
  accent: "#333333",
  contrast: "rgba(0, 0, 0, 0.15)",
};

/**
 * Returns the color palette for the given theme mode.
 *
 * @param mode "light" or "dark"
 */
export function getColorPalette(mode: ThemeMode): ColorPalette {
  return mode === "light" ? lightThemePalette : darkThemePalette;
}
