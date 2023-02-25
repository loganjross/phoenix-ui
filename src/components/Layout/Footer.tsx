import { useState } from "react";

import { Flex } from "./Flex";
import { Text } from "../Typography";
import { Button } from "../Buttons";
import { EllipsesLockup } from "../Icons";

export function Footer() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Flex centered position="absolute" posCenterX bottom={2} zIndex={1001}>
      <Text mr={1 / 2} fontSize="xs" opacity="disabled">
        Powered by
      </Text>
      <Button
        opacity={isHovered ? 1 : "subtle"}
        transition
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => window.open("https://ellipsislabs.xyz/", "_blank")}
      >
        <EllipsesLockup />
      </Button>
    </Flex>
  );
}
