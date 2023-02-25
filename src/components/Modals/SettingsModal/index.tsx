import { useSettings } from "../../../providers/SettingsProvider";
import { useModals } from "../../../providers/ModalsProvider";
import { explorerOptions } from "../../../utils/explore";
import { Flex } from "../../Layout";
import { Text } from "../../Typography";
import { OptionKey, Select, Switch } from "../../Fields";
import { Image } from "../../Image";
import { Info } from "../../Info";
import { Modal } from "..";
import { RpcSettings } from "./RpcSettings";

export * from "./SwapSettings";

export function SettingsModal() {
  const {
    settings: { themeMode, explorer },
    updateSetting,
  } = useSettings();
  const { closeModal, currentOpenModals } = useModals();

  return (
    <Modal
      title="Settings"
      isOpen={currentOpenModals.includes("settings")}
      onClose={() => closeModal("settings")}
    >
      <Switch
        position="absolute"
        top={1}
        left={11}
        iconName={themeMode === "dark" ? "moon" : "sunny"}
        isChecked={themeMode === "dark"}
        onChange={(isChecked) =>
          updateSetting("themeMode", isChecked ? "dark" : "light")
        }
      />
      <Flex align="flex-end" justify="flex-start">
        <Text variant="label" mt={2}>
          RPC Endpoint
        </Text>
        <Info
          ml={1 / 2}
          mb={1 / 4}
          label="Your connection to the Solana network."
        />
      </Flex>
      <RpcSettings />
      <Flex align="flex-end" justify="flex-start">
        <Text variant="label" mt={2}>
          Explorer
        </Text>
        <Info
          ml={1 / 2}
          mb={1 / 4}
          label="The Solana explorer you'll be redirected to when viewing transactions, accounts, etc."
        />
      </Flex>
      <Select
        w="100%"
        value={explorer}
        options={explorerOptions.map((explorer) => ({
          key: explorer.name,
          label: explorer.name,
          leftElement: (
            <Image
              w="25px"
              src={explorer.logoUri}
              alt={`${explorer.name} Logo`}
            />
          ),
        }))}
        onChange={(key: OptionKey) => {
          const explorer = explorerOptions.find(
            (explorer) => explorer.name === key
          );

          if (explorer) {
            updateSetting("explorer", explorer.name);
          }
        }}
      />
    </Modal>
  );
}
