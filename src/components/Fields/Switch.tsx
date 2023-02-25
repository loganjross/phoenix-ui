import { Flex } from "../Layout";
import { Icon } from "../Icons";
import { BaseProps } from "../../styles/base";

export function Switch({
  iconName,
  isChecked,
  onChange,
  ...baseProps
}: BaseProps & {
  iconName?: string;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}) {
  return (
    <Flex
      w="55px"
      h="30px"
      my={1 / 2}
      p={1 / 2}
      radius={2 / 3}
      bg={isChecked ? "primary" : "contrast"}
      align="center"
      justify="flex-start"
      cursor="pointer"
      onClick={() => onChange(!isChecked)}
      {...baseProps}
    >
      <Flex
        w="22px"
        h="22px"
        radius={1 / 2}
        bg={isChecked ? "base" : "contrast"}
        transition
        centered
        style={{
          marginLeft: isChecked ? "calc(100% - 20px)" : "0px",
        }}
      >
        {iconName && (
          <Icon
            name={iconName}
            c={isChecked ? "primary" : "text"}
            fontSize="xs"
          />
        )}
      </Flex>
    </Flex>
  );
}
