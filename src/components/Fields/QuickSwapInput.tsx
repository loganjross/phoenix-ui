import { useEffect, useState } from "react";
import * as Phoenix from "@ellipsis-labs/phoenix-sdk";

import { usePhoenix } from "../../providers/PhoenixProvider";
import { Flex } from "../Layout";
import { Icon } from "../Icons";
import { Input } from ".";

export function QuickSwapInput({
  onSelect,
}: {
  onSelect: (
    marketAddress: string,
    inToken: Phoenix.Token,
    inAmount: string,
    outToken: Phoenix.Token
  ) => void;
}) {
  const { client } = usePhoenix();
  const tokens = client?.tokens || [];
  const markets = client?.markets || [];
  const [commandQuery, setCommandQuery] = useState("");
  const [commandError, setCommandError] = useState("");

  function handleSelect() {
    const querySegments = commandQuery.split(" ").filter((s) => s !== "to");
    const includesAmount = !isNaN(+querySegments[0]);
    const inToken = tokens.find(
      (t) =>
        t.symbol.toLowerCase() ===
        querySegments[includesAmount ? 1 : 0].toLowerCase()
    );
    const outToken = tokens.find(
      (t) =>
        t.symbol.toLowerCase() ===
        querySegments[includesAmount ? 2 : 1].toLowerCase()
    );
    const market = markets.find(
      (m) =>
        (m.baseToken.data.mintKey.toBase58() ===
          inToken?.data.mintKey.toBase58() &&
          m.quoteToken.data.mintKey.toBase58() ===
            outToken?.data.mintKey.toBase58()) ||
        (m.baseToken.data.mintKey.toBase58() ===
          outToken?.data.mintKey.toBase58() &&
          m.quoteToken.data.mintKey.toBase58() ===
            inToken?.data.mintKey.toBase58())
    );
    if (market && inToken && outToken) {
      onSelect(
        market.address.toBase58(),
        inToken,
        includesAmount ? querySegments[0] : "",
        outToken
      );
      setCommandError("");
    } else {
      setCommandError("Invalid swap command");
    }
  }

  useEffect(() => {
    function handleFocusQuickSwap(e: KeyboardEvent) {
      if (e.key === "/") {
        e.preventDefault();
        const quickSwapInput = document.querySelector<HTMLElement>(
          ".quick-swap-input input"
        );
        quickSwapInput?.focus();
      }
    }

    window.addEventListener("keydown", handleFocusQuickSwap);

    return () => window.removeEventListener("keydown", handleFocusQuickSwap);
  }, []);

  return (
    <Flex w="100%" mb={2} className="quick-swap-input">
      <Input
        shadow
        placeholder='Try "5 wSOL to USDC"'
        value={commandQuery}
        leftElement={<Icon name="search" />}
        rightElement={
          <Flex
            w="20px"
            h="20px"
            border="text"
            radius={1 / 5}
            fontSize="xs"
            centered
            style={{ borderWidth: "1px" }}
          >
            /
          </Flex>
        }
        onChange={setCommandQuery}
        onPressEnter={handleSelect}
        error={commandError}
      />
    </Flex>
  );
}
