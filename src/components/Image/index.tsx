import { BaseProps } from "../../styles/base";
import { Flex } from "../Layout";

export function Image({
  src,
  alt,
  onClick,
  ...baseProps
}: BaseProps & {
  src: string;
  alt: string;
  onClick?: () => void;
}) {
  return (
    <Flex
      radius={1 / 2}
      cursor={onClick ? "pointer" : "auto"}
      centered
      style={{
        overflow: "hidden",
      }}
      {...baseProps}
    >
      <img width="100%" height="auto" src={src} alt={alt} onClick={onClick} />
    </Flex>
  );
}
