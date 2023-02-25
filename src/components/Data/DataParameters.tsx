import { useEffect, useState } from "react";
import { useTheme } from "styled-components";
import * as Phoenix from "@ellipsis-labs/phoenix-sdk";

import { usePhoenix } from "../../providers/PhoenixProvider";
import { useData } from "../../providers/DataProvider";
import { useModals } from "../../providers/ModalsProvider";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { checkAccountPubkey } from "../../utils/solana";
import { Flex } from "../Layout";
import { Text } from "../Typography";
import { GhostButton } from "../Buttons";
import { Input, QueryDatePicker } from "../Fields";
import { Image } from "../Image";
import { Icon } from "../Icons";
import { Skeleton } from "../Loader";

function SelectMarketButton({
  market,
  onClick,
  disabled,
}: {
  market: Phoenix.Market | null;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <GhostButton
      minH="70px"
      mx={2}
      bg="contrast"
      radius={3 / 4}
      onClick={onClick}
      disabled={disabled}
    >
      {market ? (
        <>
          <Image
            w="40px"
            mr={1.25}
            src={market.baseToken.logoUri}
            alt={`${market.name} Logo`}
          />
          <Text fontSize="xl" fontWeight="bold">
            {market.name}
          </Text>
        </>
      ) : (
        <Flex centered>
          <Skeleton mr={1.25} w="40px" ribHeight={40} />
          <Skeleton w="190px" ribHeight={30} />
        </Flex>
      )}
      <Icon name="chevron-down" ml={1} fontSize="lg" />
    </GhostButton>
  );
}

export function DataParameters({
  showTraderInput,
}: {
  showTraderInput?: boolean;
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.view.breakpoint.mobile);
  const { openModal } = useModals();
  const { currentMarket } = usePhoenix();
  const { currentTraderAddress, setCurrentTraderAddress } = useData();
  const [traderAddress, setTraderAddress] = useState("");
  const [isValidPubkey, setIsValidPubkey] = useState(false);
  const [isCheckingPubkey, setIsCheckingPubkey] = useState(false);

  useEffect(() => {
    if (currentTraderAddress !== traderAddress) {
      setTraderAddress(currentTraderAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTraderAddress]);

  useEffect(() => {
    if (traderAddress) {
      setIsCheckingPubkey(true);
      checkAccountPubkey(traderAddress)
        .then((isValid) => {
          setIsValidPubkey(isValid);
          setIsCheckingPubkey(false);
          setCurrentTraderAddress(isValid ? traderAddress : "");
        })
        .catch(() => {
          setIsValidPubkey(false);
          setIsCheckingPubkey(false);
        });
    }
  }, [traderAddress, setCurrentTraderAddress]);

  return (
    <Flex centered column>
      <Flex mb={1} centered column={isSmallScreen}>
        <QueryDatePicker isStartDate />
        <SelectMarketButton
          market={currentMarket}
          onClick={() => openModal("market-select")}
        />
        <QueryDatePicker />
      </Flex>
      {showTraderInput && (
        <Input
          w="100%"
          maxW="615px"
          mx={3}
          mb={2}
          label="Trader Public Key"
          value={traderAddress}
          border={
            traderAddress && isValidPubkey && !isCheckingPubkey
              ? "success"
              : undefined
          }
          leftElement={<Icon name="person" ml={1 / 2} />}
          rightElement={
            traderAddress && (
              <Flex
                p={1 / 2}
                cursor="pointer"
                centered
                onClick={() => setCurrentTraderAddress("")}
              >
                <Icon name="close" />
              </Flex>
            )
          }
          onChange={setTraderAddress}
          error={
            !traderAddress
              ? "Paste a Public Key"
              : !isValidPubkey && !isCheckingPubkey
              ? "Invalid Public Key"
              : undefined
          }
        />
      )}
    </Flex>
  );
}
