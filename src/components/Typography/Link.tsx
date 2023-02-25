import { useState } from "react";
import { useTheme } from "styled-components";

import { BaseProps } from "../../styles/base";
import { Flex } from "../Layout";

export function Link({
  href,
  target,
  rel,
  children,
  ...baseProps
}: {
  href: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
} & BaseProps) {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Flex {...baseProps}>
      <a
        href={href}
        target={target}
        rel={rel}
        style={{
          color: theme.palette[baseProps.c || "secondary"],
          textDecoration: isHovered ? "underline" : "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Flex centered>{children}</Flex>
      </a>
    </Flex>
  );
}
