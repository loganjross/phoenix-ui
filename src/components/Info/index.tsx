import { useState } from "react";

import { BaseProps } from "../../styles/base";
import { Flex } from "../Layout";
import { Icon } from "../Icons";

export function Info({ label, ...baseProps }: { label: string } & BaseProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Flex
      position="relative"
      opacity={isOpen ? 1 : "disabled"}
      centered
      transition
      {...baseProps}
    >
      <Flex
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Icon name="information-circle" />
      </Flex>
      <Flex
        w="225px"
        maxH="200px"
        position="absolute"
        posCenterX
        bottom={isOpen ? 2 : 3}
        bg="base"
        border="modal"
        radius={1}
        fontSize="sm"
        opacity={isOpen ? 1 : 0}
        shadow
        transition
        overflow="hidden"
        zIndex={isOpen ? 3000 : -3000}
        style={{ pointerEvents: "none" }}
      >
        <Flex p={1.5} bg="modal">
          {label}
        </Flex>
      </Flex>
    </Flex>
  );
}
