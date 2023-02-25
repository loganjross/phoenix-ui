import { useSolana } from "../../providers/SolanaProvider";
import { useModals } from "../../providers/ModalsProvider";
import { formatPubkey } from "../../utils/format";
import { IconButton } from ".";
import { Text } from "../Typography";
import { Icon } from "../Icons";

export function WalletButton() {
  const {
    wallet: { publicKey },
  } = useSolana();
  const { openModal } = useModals();

  return (
    <IconButton
      border={publicKey ? "success" : undefined}
      onClick={() => openModal("connect-wallet")}
    >
      <Icon name="wallet" fontSize="xl" />
      {publicKey && (
        <Text fontWeight="bold" fontSize="xs">
          &nbsp;&nbsp;{formatPubkey(publicKey)}
        </Text>
      )}
    </IconButton>
  );
}
