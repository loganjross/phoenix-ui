import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
    position: relative;
    width: 100%;
    min-width: 100vw;
    height: auto;
    min-height: 100vh;
    margin: 0;
    padding: 0 0 ${({ theme }) => theme.spacing * 6}px 0;
    background: ${({ theme }) =>
      `linear-gradient(${theme.palette.base} 30%, ${
        theme.mode === "dark" ? "#361a01 250%" : "#ffe0b3 350%"
      })`};
    color: ${({ theme }) => theme.palette.text};
    font-family: Inter, Open-Sans, Sans-Serif;
    font-size: ${({ theme }) => theme.fontSize.base};
  }
  h1, h2, h3, h4, p, span {
    margin: unset;
  }
  * {
    box-sizing: border-box;
  }
  *:focus-visible {
    outline: unset;
  }
  ::-webkit-scrollbar {
    display: none;
  }

  // Overrides
  .react-datepicker {
    background: ${({ theme }) => theme.palette.base};
    border-color: ${({ theme }) => theme.palette.contrast};
    border-radius: ${({ theme }) => theme.radius}px;
    box-shadow: ${({ theme }) => theme.shadow};
    overflow: hidden;
    * {
      color: ${({ theme }) => theme.palette.text};
      border-color: inherit;
    }

    &__header{
      background: ${({ theme }) => theme.palette.contrast};
    }
    &__time-box {
      background: ${({ theme }) => theme.palette.base};
    }
    &__day, &__time-list-item {
      border-radius: ${({ theme }) => theme.radius / 2}px !important;
      &:hover, &--today {
        background: ${({ theme }) => theme.palette.contrast} !important;
      }
      &--selected {
        background: ${({ theme }) => theme.palette.primary} !important;
        color: ${({ theme }) =>
          theme.palette[theme.mode === "dark" ? "base" : "text"]} !important;
        &:hover {
          background: ${({ theme }) => theme.palette.primary} !important;
        }
      }
      &--disabled {
        opacity: ${({ theme }) => theme.opacity.disabled};
        cursor: not-allowed;
        &:hover {
          background: unset !important;
        }
      }
    }
  }
`;
