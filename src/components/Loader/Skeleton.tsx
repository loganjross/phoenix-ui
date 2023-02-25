import styled from "styled-components";
import { BaseProps } from "../../styles/base";
import { Flex } from "../Layout";

const Rib = styled(Flex)`
  animation: pulse 1.25s infinite ease-in-out;

  @keyframes pulse {
    0% {
      opacity: ${({ theme }) => theme.opacity.disabled};
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: ${({ theme }) => theme.opacity.disabled};
    }
  }
`;

export function Skeleton({
  ribHeight = 20,
  ribSpacing = 1 / 2,
  headers = 0,
  rows = 1,
  ...baseProps
}: {
  ribHeight?: number;
  ribSpacing?: number;
  headers?: number;
  rows?: number;
} & BaseProps) {
  const headerRibs = Array.from({ length: headers });
  const rowRibs = Array.from({ length: rows });

  return (
    <Flex w="100%" column {...baseProps}>
      {headerRibs.map((_, i) => (
        <Rib
          key={i}
          w="50%"
          h={ribHeight + "px"}
          my={ribSpacing}
          bg="accent"
          radius={1 / 2}
        />
      ))}
      {rowRibs.map((_, i) => (
        <Rib
          key={headerRibs.length + i}
          w="100%"
          h={ribHeight + "px"}
          my={ribSpacing}
          bg="accent"
          radius={1 / 2}
        />
      ))}
    </Flex>
  );
}
