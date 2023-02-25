import { useTheme } from "styled-components";

import { Theme } from "../../styles/theme";

export * from "./Skeleton";

export function Loader({
  color,
  size,
}: {
  color?: keyof Theme["palette"];
  size?: number;
}) {
  const { palette } = useTheme();

  return (
    <svg
      version="1.1"
      id="L4"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      width={size || 50}
      height={size || 50}
      enableBackground="new 0 0 0 0"
      xmlSpace="preserve"
    >
      <circle
        fill={palette[color || "base"]}
        stroke="none"
        cx={size ? size / 5 : 10}
        cy="50"
        r={size ? size / 5 : "10"}
      >
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.1"
        />
      </circle>
      <circle
        fill={palette[color || "base"]}
        stroke="none"
        cx="50"
        cy="50"
        r={size ? size / 5 : "10"}
      >
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.2"
        />
      </circle>
      <circle
        fill={palette[color || "base"]}
        stroke="none"
        cx={100 - (size ? size / 5 : 10)}
        cy="50"
        r={size ? size / 5 : "10"}
      >
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.3"
        />
      </circle>
    </svg>
  );
}
