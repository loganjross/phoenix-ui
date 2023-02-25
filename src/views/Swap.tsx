import { useEffect, useState } from "react";
import { ComputeBudgetProgram } from "@solana/web3.js";
import * as Phoenix from "@ellipsis-labs/phoenix-sdk";
import { useTheme } from "styled-components";

import { useSettings } from "../providers/SettingsProvider";
import { useSolana } from "../providers/SolanaProvider";
import { usePhoenix } from "../providers/PhoenixProvider";
import { useModals } from "../providers/ModalsProvider";
import { COMPUTE_UNIT_LIMIT, MICROLAMPORTS_PER_SOL } from "../utils/solana";
import { openTxInExplorer } from "../utils/explore";
import { notify } from "../utils/notify";
import { formatNumberToString } from "../utils/format";
import { checkUserLocation } from "../utils/location";
import { Flex } from "../components/Layout";
import { Text } from "../components/Typography";
import { Input } from "../components/Fields";
import { PrimaryButton, GhostButton, IconButton } from "../components/Buttons";
import { Icon } from "../components/Icons";
import { Image } from "../components/Image";
import { QuickSwapInput } from "../components/Fields/QuickSwapInput";
import { Loader, Skeleton } from "../components/Loader";
import { TokenSelectModal } from "../components/Modals";

function SelectTokenButton({
  token,
  onClick,
  disabled,
}: {
  token: Phoenix.Token | null;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <GhostButton
      minH="45px"
      radius={3 / 4}
      onClick={onClick}
      disabled={disabled}
    >
      {token && (
        <Image
          w="25px"
          mr={1 / 2}
          src={token.logoUri}
          alt={`${token.name} Logo`}
        />
      )}
      {token ? (
        <Flex centered>
          <Text fontWeight="bold">{token.symbol}</Text>
          <Icon name="chevron-down" ml={1 / 2} fontSize="sm" />
        </Flex>
      ) : (
        <Flex centered>
          <Skeleton w="20px" mr={1 / 2} />
          <Skeleton w="60px" />
        </Flex>
      )}
    </GhostButton>
  );
}

export function Swap() {
  const [isGeobanned, setIsGeobanned] = useState(false);
  const theme = useTheme();
  const { openModal } = useModals();
  const {
    settings: { explorer, swapSettings },
  } = useSettings();
  const {
    cluster,
    connection,
    wallet: { publicKey, sendTransaction },
  } = useSolana();
  const {
    isLoading: isPhoenixLoading,
    client,
    currentMarket,
    changeMarket,
  } = usePhoenix();
  const { markets, tokens, trader } = client || {
    markets: [],
    tokens: [],
    trader: null,
  };
  const marketPairs = markets.map((market) => market.name);
  const [selectionToken, setSelectionToken] = useState<"in" | "out">("in");
  const [inToken, setInToken] = useState<Phoenix.Token | null>(null);
  const [outToken, setOutToken] = useState<Phoenix.Token | null>(null);
  const side =
    inToken?.symbol === currentMarket?.quoteToken.symbol
      ? Phoenix.Side.Bid
      : Phoenix.Side.Ask;
  const [inAmount, setInAmount] = useState("");
  const expectedOutAmount =
    currentMarket && inAmount
      ? currentMarket.getExpectedOutAmount({
          side,
          inAmount: parseFloat(inAmount),
        })
      : 0;
  const [outAmount, setOutAmount] = useState<number>(0);
  const maxInAmount =
    trader?.tokenBalances[inToken?.data.mintKey.toBase58() || ""]?.uiAmount ||
    0;
  const inTokenOptions = outToken
    ? tokens.filter(
        (token) =>
          marketPairs.includes(`${outToken.symbol}/${token.symbol}`) ||
          marketPairs.includes(`${token.symbol}/${outToken.symbol}`)
      )
    : tokens;
  const outTokenOptions = inToken
    ? tokens.filter(
        (token) =>
          marketPairs.includes(`${inToken.symbol}/${token.symbol}`) ||
          marketPairs.includes(`${token.symbol}/${inToken.symbol}`)
      )
    : tokens;
  const [isSendingTx, setIsSendingTx] = useState(false);
  const [wasTxError, setWasTxError] = useState(false);

  function handleTokenSelect(token: Phoenix.Token) {
    selectionToken === "in" ? setInToken(token) : setOutToken(token);
    const market = markets.find(
      (market) =>
        market.baseToken.symbol === token.symbol ||
        market.quoteToken.symbol === token.symbol
    );
    if (
      !!market &&
      market.address.toBase58() !== currentMarket?.address.toBase58()
    ) {
      changeMarket(market.address.toBase58());
    }
  }

  async function handleSwap() {
    if (isGeobanned || !publicKey || !currentMarket || !inToken || !outToken) {
      console.error("Missing data to submit swap");
      return;
    }

    const outAmount = expectedOutAmount;
    setOutAmount(outAmount);
    setIsSendingTx(true);
    const notificationId = notify({
      content: "Preparing transaction...",
      type: "loading",
    });

    let txId = "";
    let wasTxError = false;
    try {
      const tx = currentMarket.getSwapTransaction({
        side,
        inAmount: parseFloat(inAmount),
        slippage: swapSettings.slippage,
        trader: publicKey,
      });

      if (!!swapSettings.priorityFee) {
        const microLamports =
          (swapSettings.priorityFee * MICROLAMPORTS_PER_SOL) /
          COMPUTE_UNIT_LIMIT;
        tx.add(
          ComputeBudgetProgram.setComputeUnitLimit({
            units: COMPUTE_UNIT_LIMIT,
          })
        );
        tx.add(
          ComputeBudgetProgram.setComputeUnitPrice({
            microLamports,
          })
        );
      }

      txId = await sendTransaction(tx, connection, {
        skipPreflight: true,
      });

      const txDetails = await connection.confirmTransaction(txId, "processed");
      if (!!txDetails?.value.err) {
        wasTxError = true;
        console.error("Swap transaction failed: ", txDetails.value.err);
      }
    } catch (err: any) {
      console.error("Unable to submit swap transaction: ", err);
      if (err.toString().includes("rejected")) {
        notify({
          id: notificationId,
          content: "Swap transaction cancelled.",
          shortDuration: true,
        });
      }
    }

    if (!!txId) {
      notify({
        id: notificationId,
        content: (
          <Flex
            pr={1.5}
            align="center"
            onClick={() =>
              !!txId ? openTxInExplorer(txId, explorer, cluster) : null
            }
          >
            {wasTxError
              ? "Swap transaction failed."
              : `${parseFloat(inAmount).toFixed(2)} ${
                  inToken.symbol
                } ⇄ ${outAmount.toFixed(2)} ${outToken.symbol}`}
            {!!txId && (
              <Icon
                name="open-outline"
                position="absolute"
                right={1}
                fontSize="lg"
              />
            )}
          </Flex>
        ),
        type: wasTxError ? "error" : "success",
        style: { cursor: !!txId ? "pointer" : "unset" },
      });
    }

    setIsSendingTx(false);
    if (wasTxError) {
      setWasTxError(true);
    } else {
      setInAmount("");
      setOutAmount(0);
      setWasTxError(false);
    }
  }

  // Set in / out tokens
  useEffect(() => {
    if (!currentMarket || !tokens) return;

    setInToken(
      tokens.find((token) => token.symbol === currentMarket.baseToken.symbol) ||
        null
    );
    setOutToken(
      tokens.find(
        (token) => token.symbol === currentMarket.quoteToken.symbol
      ) || null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMarket?.address]);

  // Check user's location and geoban if in US (mainnet only)
  useEffect(() => {
    if (!!currentMarket && cluster === "mainnet-beta") {
      checkUserLocation().then((isGeobanned) => {
        setIsGeobanned(isGeobanned);
        openModal("geobanned");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMarket, cluster]);

  return (
    <Flex w="95%" maxW="375px" mt={1} mb={2} mx="auto" column>
      <QuickSwapInput
        onSelect={(
          marketAddress: string,
          inToken: Phoenix.Token,
          inAmount: string,
          outToken: Phoenix.Token
        ) => {
          changeMarket(marketAddress);
          setInToken(inToken);
          setInAmount(inAmount);
          setOutToken(outToken);
        }}
      />
      <Flex w="100%" mb={1} align="flex-end" justify="flex-end">
        <IconButton onClick={() => openModal("swap-settings")}>
          <Icon ml={1 / 3} mr={1 / 2} name="options" c="text" fontSize="xl" />
          <Text mr={1 / 3} fontSize="sm">
            {swapSettings.slippage * 100}%
          </Text>
        </IconButton>
      </Flex>
      <Flex
        w="100%"
        mb={3.5}
        p={2}
        bg={theme.mode === "light" ? "base" : "contrast"}
        radius={1}
        shadow
        column
      >
        <Text m={1} fontSize="sm" fontWeight="bold">
          You pay
        </Text>
        <Input
          type="number"
          value={inAmount}
          max={maxInAmount}
          leftElement={
            <Flex ml={-0.5}>
              <SelectTokenButton
                token={inToken}
                onClick={() => {
                  setSelectionToken("in");
                  openModal("token-select");
                }}
                disabled={isPhoenixLoading || isSendingTx}
              />
            </Flex>
          }
          error={wasTxError}
          onChange={(amount: string) => setInAmount(amount)}
          disabled={isPhoenixLoading || !publicKey || !inToken || isSendingTx}
        />
        <Flex w="100%" my={1} centered>
          <IconButton
            onClick={() => {
              setInToken(outToken);
              setInAmount(expectedOutAmount.toString());
              setOutToken(inToken);
            }}
            disabled={isPhoenixLoading || isSendingTx || !inToken || !outToken}
          >
            <Icon name="swap-vertical" fontSize="lg" />
          </IconButton>
        </Flex>
        <Text m={1} fontSize="sm" fontWeight="bold">
          You receive
        </Text>
        <Flex w="100%" p={1 / 2} align="center" justify="space-between">
          <SelectTokenButton
            token={outToken}
            onClick={() => {
              setSelectionToken("out");
              openModal("token-select");
            }}
            disabled={isPhoenixLoading || isSendingTx}
          />
          <Text fontSize="xl" fontWeight="bold">
            {expectedOutAmount
              ? formatNumberToString(
                  isSendingTx ? outAmount : expectedOutAmount,
                  outToken?.data.decimals
                )
              : ""}
          </Text>
        </Flex>
      </Flex>
      <PrimaryButton
        w="100%"
        onClick={() =>
          isGeobanned
            ? null
            : !!publicKey
            ? handleSwap()
            : openModal("connect-wallet")
        }
        disabled={
          isGeobanned ||
          (!!publicKey &&
            (isPhoenixLoading ||
              isSendingTx ||
              !inToken ||
              +inAmount === 0 ||
              !outToken ||
              +expectedOutAmount === 0))
        }
      >
        {isPhoenixLoading || isSendingTx ? (
          <Loader />
        ) : !!publicKey ? (
          "Swap"
        ) : (
          "Connect wallet"
        )}
      </PrimaryButton>
      <TokenSelectModal
        title={selectionToken === "in" ? "You pay" : "You receive"}
        currentToken={selectionToken === "in" ? inToken : outToken}
        tokenOptions={
          selectionToken === "in" ? inTokenOptions : outTokenOptions
        }
        onSelect={handleTokenSelect}
      />
    </Flex>
  );
}
