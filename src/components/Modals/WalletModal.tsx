import { useSolana } from "../../providers/SolanaProvider";
import { useModals } from "../../providers/ModalsProvider";
import { formatPubkey } from "../../utils/format";
import { notify } from "../../utils/notify";
import { Flex } from "../Layout";
import { Text } from "../Typography";
import { Image } from "../Image";
import { Modal } from ".";

function WalletOption({
  label,
  connectedPubkey,
  iconUrl,
  isConnected,
  onClick,
  disabled,
}: {
  label: string;
  connectedPubkey: string;
  iconUrl: string;
  isConnected: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Flex
      w="100%"
      align="center"
      justify="space-between"
      mb={1}
      py={1}
      px={1.5}
      bg="contrast"
      border={isConnected ? "success" : undefined}
      radius={1}
      shadow={isConnected}
      opacity={disabled ? "subtle" : 1}
      cursor="pointer"
      onClick={onClick}
    >
      <Image w="30px" h="auto" src={iconUrl} alt={label} />
      <Flex align="flex-end" justify="center" column>
        <Text opacity={isConnected ? 1 : "subtle"}>{label}</Text>
        {isConnected && !!connectedPubkey && (
          <Text mt={1 / 2} c="success" fontSize="xs">
            {formatPubkey(connectedPubkey)}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}

export function WalletModal() {
  const {
    wallet: { name, publicKey, options, select },
  } = useSolana();
  const { closeModal, currentOpenModals } = useModals();

  return (
    <Modal
      maxW="375px"
      title="Wallet"
      isOpen={currentOpenModals.includes("connect-wallet")}
      onClose={() => closeModal("connect-wallet")}
    >
      <Flex w="100%" wrapped>
        {options.map((wal) => (
          <WalletOption
            key={wal.adapter.name}
            label={wal.adapter.name}
            connectedPubkey={publicKey?.toBase58() || ""}
            iconUrl={wal.adapter.icon}
            isConnected={!!(publicKey && name === wal.adapter.name)}
            onClick={() => {
              select(wal.adapter.name);
              wal.adapter[
                wal.adapter.connected ? "disconnect" : "connect"
              ]().then(() => {
                notify({
                  content: `${wal.adapter.name} ${
                    wal.adapter.publicKey
                      ? `${formatPubkey(
                          wal.adapter.publicKey || ""
                        )} connected.`
                      : "disconnected."
                  }`,
                  type: wal.adapter.connected ? "success" : "error",
                });
              });
            }}
            disabled={!!(publicKey && name !== wal.adapter.name)}
          />
        ))}
      </Flex>
    </Modal>
  );
}
