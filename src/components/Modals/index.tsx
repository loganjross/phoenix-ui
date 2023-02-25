import { useEffect } from "react";
import { useTheme } from "styled-components";

import { useMediaQuery } from "../../hooks/useMediaQuery";
import { BaseProps } from "../../styles/base";
import { Flex } from "../Layout";
import { Text } from "../Typography";
import { CloseButton } from "../Buttons";
import { WalletModal } from "./WalletModal";
import { SettingsModal, SwapSettingsModal } from "./SettingsModal";
import { MarketSelectModal } from "./MarketSelectModal";
import { GeobannedModal } from "./GeobannedModal";

export * from "./TokenSelectModal";

export interface ModalProps extends BaseProps {
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
}

export function Modal({
  title,
  isOpen,
  onClose,
  children,
  ...baseProps
}: ModalProps & { children: React.ReactNode }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.view.breakpoint.mobile);

  function checkClick({
    clientX,
  }: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const modalRect = document.querySelector(".modal")?.getBoundingClientRect();
    if (modalRect && clientX > modalRect.left && clientX < modalRect.right) {
      return;
    }

    if (onClose) onClose();
  }

  document.addEventListener("keydown", (e) => {
    if (onClose && isOpen && e.key === "Escape") {
      onClose();
    }
  });

  useEffect(() => {
    const body = document.querySelector("body");
    if (!body) return;

    if (isOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <Flex
      position="absolute"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg="modal"
      opacity={isOpen ? 1 : 0}
      transition
      zIndex={isOpen ? 2000 : -2000}
      onClick={checkClick}
    >
      <Flex
        className="modal"
        position="absolute"
        posCenterX
        top={isOpen ? (isSmallScreen ? 5 : 10) : isSmallScreen ? 7.5 : 12.5}
        w="90%"
        maxW="425px"
        minH="100px"
        maxH="700px"
        p={2}
        bg="base"
        radius={1.25}
        opacity={isOpen ? 1 : 0}
        shadow
        column
        style={{
          transitionDuration: theme.transition * 1.5 + "s",
          transitionTimingFunction: "ease-out",
        }}
        {...baseProps}
      >
        {onClose && <CloseButton onClose={onClose} />}
        {!!title && <Text variant="header">{title}</Text>}
        {children}
      </Flex>
    </Flex>
  );
}

export function Modals() {
  return (
    <>
      <WalletModal />
      <SettingsModal />
      <SwapSettingsModal />
      <MarketSelectModal />
      <GeobannedModal />
    </>
  );
}
