import { ColorPalette, getColorPalette } from "./palette";

export type ThemeMode = "light" | "dark";

/**
 * Theme
 * @description This is the main object that is used to style the app.
 *
 * @example
 * const Button = styled.button`
 *  background: ${({ theme }) => theme.palette.primary};
 *  color: ${({ theme }) => theme.palette.text};
 * `;
 *
 * @property {ThemeMode} mode ("light" or "dark")
 * @property {ColorPalette} palette (The color palette)
 * @property {number} radius (The base radius for all elements)
 * @property {string} shadow (The base shadow for all elements)
 * @property {Object} opacity (The base opacity values for all elements)
 * @property {number} spacing (The base spacing for all elements)
 * @property {number} transition (The base transition duration for all elements)
 * @property {Object} font (Font stylings)
 */
export interface Theme {
  mode: ThemeMode;
  palette: ColorPalette;
  radius: number;
  shadow: string;
  opacity: {
    disabled: number;
    subtle: number;
  };
  spacing: number;
  transition: number;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
  };
  view: {
    gutter: number;
    breakpoint: {
      mobile: number;
    };
  };
}

/**
 * Get the theme object for a given mode.
 *
 * @param mode "light" or "dark"
 */
export function getTheme(mode: ThemeMode): Theme {
  return {
    mode,
    get palette() {
      return getColorPalette(this.mode);
    },
    radius: 20,
    get shadow() {
      const alpha = this.mode === "light" ? 0.3 : 1;
      return `0px 10px 25px -15px rgba(0, 0, 0, ${alpha})`;
    },
    opacity: {
      disabled: 0.6,
      subtle: 0.8,
    },
    spacing: 10,
    transition: 0.1,
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "22px",
    },
    view: {
      gutter: 1200,
      breakpoint: {
        mobile: 1200,
      },
    },
  };
}
