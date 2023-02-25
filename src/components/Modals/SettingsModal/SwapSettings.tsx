import { useState } from "react";
import * as Phoenix from "@ellipsis-labs/phoenix-sdk";

import { useSettings } from "../../../providers/SettingsProvider";
import { useModals } from "../../../providers/ModalsProvider";
import { Flex } from "../../Layout";
import { Text } from "../../Typography";
import { Input } from "../../Fields";
import { GhostButton } from "../../Buttons";
import { Info } from "../../Info";
import { Modal } from "..";

const SLIPPAGE_OPTIONS = [0.001, Phoenix.DEFAULT_SLIPPAGE_PERCENT, 0.01];
const PRIORITY_FEE_OPTIONS = [
  { label: "Normal", amount: 0 },
  { label: "Fast", amount: 0.000005 },
  { label: "Very Fast", amount: 0.0005 },
];

export function SwapSettingsModal() {
  const {
    settings: { swapSettings },
    updateSetting,
  } = useSettings();
  const { closeModal, currentOpenModals } = useModals();
  const [customSlippage, setCustomSlippage] = useState("");

  return (
    <Modal
      title="Swap Settings"
      isOpen={currentOpenModals.includes("swap-settings")}
      onClose={() => closeModal("swap-settings")}
    >
      <Flex align="flex-end" justify="flex-start">
        <Text variant="label" mt={2}>
          Priority Fee
        </Text>
        <Info
          ml={1 / 2}
          mb={1 / 4}
          label="The amount of SOL you are willing to pay to get your transaction confirmed faster."
        />
      </Flex>
      <Flex w="100%" mt={1} align="center" justify="space-between">
        {PRIORITY_FEE_OPTIONS.map((fee) => (
          <GhostButton
            key={fee.label}
            w="33%"
            h="85px"
            maxH="unset"
            mx={fee.label === "Fast" ? 2 : undefined}
            bg="contrast"
            border={
              fee.amount === swapSettings.priorityFee ? "primary" : undefined
            }
            onClick={() =>
              updateSetting("swapSettings", {
                ...swapSettings,
                priorityFee: fee.amount,
              })
            }
            style={{
              flexDirection: "column",
            }}
          >
            {fee.label}
            <Text mt={1 / 4} fontSize="xs" fontWeight="normal" opacity="subtle">
              {fee.amount} SOL
            </Text>
          </GhostButton>
        ))}
      </Flex>
      <Flex align="flex-end" justify="flex-start">
        <Text variant="label" mt={2}>
          Slippage
        </Text>
        <Info
          ml={1 / 2}
          mb={1 / 4}
          label="The most you'll tolerate your received amount differing from the estimate."
        />
      </Flex>
      <Flex w="100%" align="center" justify="space-between">
        {SLIPPAGE_OPTIONS.map((slip) => (
          <GhostButton
            key={slip}
            w="20%"
            mr={1 / 2}
            bg="contrast"
            border={slip === swapSettings.slippage ? "primary" : undefined}
            onClick={() =>
              updateSetting("swapSettings", { ...swapSettings, slippage: slip })
            }
          >
            {slip * 100}%
          </GhostButton>
        ))}
        <Input
          w="30%"
          border={
            +customSlippage === swapSettings.slippage ? "primary" : undefined
          }
          type="number"
          placeholder="0.00"
          value={customSlippage}
          rightElement="%"
          onClick={() =>
            customSlippage
              ? updateSetting("swapSettings", {
                  ...swapSettings,
                  slippage: +customSlippage,
                })
              : null
          }
          onChange={(customSlippage: string) => {
            setCustomSlippage(customSlippage);
            updateSetting("swapSettings", {
              ...swapSettings,
              slippage: +customSlippage,
            });
          }}
          onBlur={() =>
            !customSlippage
              ? updateSetting("swapSettings", {
                  ...swapSettings,
                  slippage: Phoenix.DEFAULT_SLIPPAGE_PERCENT,
                })
              : null
          }
        />
      </Flex>
    </Modal>
  );
}
