import { css } from "styled-components";

export const fireAnimation = css`
  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.palette.primary},
    ${({ theme }) => theme.palette.secondary},
    ${({ theme }) => theme.palette.primary},
    ${({ theme }) => theme.palette.secondary}
  );
  background-position: 100% 0;
  background-size: 300% 100%;
  animation: fireGradient 1.5s infinite alternate-reverse both ease-in-out;

  @keyframes fireGradient {
    from {
      background-position: 100% 0;
    }
    to {
      background-position: 0% 0;
    }
  }
`;
