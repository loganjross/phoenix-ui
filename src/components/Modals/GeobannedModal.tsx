import { useNavigate } from "react-router";

import { useModals } from "../../providers/ModalsProvider";
import { BANNED_COUNTRY_CODES } from "../../utils/location";
import { Modal } from ".";
import { Flex } from "../Layout";
import { GhostButton } from "../Buttons";
import { Text } from "../Typography";
import { Icon } from "../Icons";

export function GeobannedModal() {
  const navigate = useNavigate();
  const { currentOpenModals, closeModal } = useModals();

  return (
    <Modal maxW="375px" isOpen={currentOpenModals.includes("geobanned")}>
      <Flex>
        <Icon name="lock-closed" mr={1 / 2} c="error" fontSize="xl" />
        <Text variant="header" c="error">
          Region not supported
        </Text>
      </Flex>
      <Text mb={2} fontSize="sm">
        Looks like you're in an unsupported region, and therefore cannot access
        our swap interface. You can still view our stats pages.
      </Text>
      <Text variant="label" mb={2}>
        Banned regions: {BANNED_COUNTRY_CODES.map((code) => code).join(", ")}
      </Text>
      <GhostButton
        w="100%"
        bg="error"
        c="base"
        onClick={() => {
          navigate("/data");
          closeModal("geobanned");
        }}
      >
        Get me out of here
      </GhostButton>
    </Modal>
  );
}
