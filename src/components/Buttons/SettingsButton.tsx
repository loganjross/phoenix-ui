import { useModals } from "../../providers/ModalsProvider";
import { IconButton } from ".";
import { Icon } from "../Icons";

export function SettingsButton() {
  const { openModal } = useModals();

  return (
    <IconButton onClick={() => openModal("settings")}>
      <Icon name="settings-sharp" c="text" fontSize="xl" />
    </IconButton>
  );
}
