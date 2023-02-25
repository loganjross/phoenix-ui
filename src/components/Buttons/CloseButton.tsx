import { Icon } from "../Icons";
import { Button } from ".";

export function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <Button position="absolute" top={1} right={1} p={1 / 2} onClick={onClose}>
      <Icon name="close" fontSize="xl" />
    </Button>
  );
}
