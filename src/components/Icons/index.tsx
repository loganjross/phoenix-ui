import { useTheme } from "styled-components";
import { IonIcon } from "@ionic/react";

import { BaseProps } from "../../styles/base";
import { Flex } from "../Layout";

export * from "./Logos";

export function Icon({
  name,
  ...baseProps
}: BaseProps & {
  name: string;
}) {
  const { palette, fontSize } = useTheme();

  return (
    <Flex {...baseProps}>
      <IonIcon
        icon={name}
        color={palette[baseProps.c || "text"]}
        style={{
          color: palette[baseProps.c || "text"],
          fontSize: fontSize[baseProps.fontSize || "base"],
        }}
      />
    </Flex>
  );
}
