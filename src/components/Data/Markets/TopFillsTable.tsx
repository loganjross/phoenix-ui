import { useState } from "react";
import { useTheme } from "styled-components";

import { useSettings } from "../../../providers/SettingsProvider";
import { useSolana } from "../../../providers/SolanaProvider";
import { usePhoenix } from "../../../providers/PhoenixProvider";
import { ApiMarketData } from "../../../providers/DataProvider";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { formatNumberToString, formatPubkey } from "../../../utils/format";
import { openTxInExplorer } from "../../../utils/explore";
import { Flex } from "../../Layout";
import { Text } from "../../Typography";
import { Toggle } from "../../Fields";
import { Icon } from "../../Icons";
import { Skeleton } from "../../Loader";

const MAX_TOP_TRADES = 5;

export function TopFillsTable({
  topFills,
}: {
  topFills: ApiMarketData["topFills"];
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.view.breakpoint.mobile);
  const {
    settings: { explorer },
  } = useSettings();
  const { cluster } = useSolana();
  const { currentMarket } = usePhoenix();
  const [isViewingByBase, setIsViewingByBase] = useState(true);

  return (
    <Flex
      position="relative"
      w="100%"
      maxW={isSmallScreen ? undefined : "420px"}
      h="100%"
      my={1}
      p={2}
      bg="contrast"
      radius={1}
      shadow
      column
    >
      <Text variant="label" mb={2}>
        Top Trades
      </Text>
      <Flex w="100%" align="center" justify="space-between" mb={1}>
        <Flex
          w="50%"
          pl={1}
          fontSize="sm"
          fontWeight="bold"
          align="center"
          justify="flex-start"
        >
          TX ID
        </Flex>
        <Flex
          w="50%"
          fontSize="sm"
          fontWeight="bold"
          align="center"
          justify="flex-end"
        >
          <Toggle
            size="sm"
            options={[
              {
                label: currentMarket?.baseToken.symbol || "Base",
                isActive: isViewingByBase,
                onClick: () => setIsViewingByBase(true),
              },
              {
                label: currentMarket?.quoteToken.symbol || "Quote",
                isActive: !isViewingByBase,
                onClick: () => setIsViewingByBase(false),
              },
            ]}
          />
        </Flex>
      </Flex>
      {!topFills[isViewingByBase ? "base" : "quote"].length ||
      !currentMarket ? (
        <Skeleton ribHeight={25} rows={6} />
      ) : (
        <Flex w="100%" h="250px" column>
          {topFills[isViewingByBase ? "base" : "quote"]
            .sort(
              (a, b) =>
                +b[
                  isViewingByBase ? "base_units_filled" : "quote_units_filled"
                ] -
                +a[isViewingByBase ? "base_units_filled" : "quote_units_filled"]
            )
            .slice(0, MAX_TOP_TRADES)
            .map((fill, i) => (
              <Flex
                key={i}
                w="100%"
                mb={1 / 2}
                p={1}
                bg={!(i % 2) ? "contrast" : undefined}
                justify="space-between"
                align="center"
              >
                <Flex
                  w="50%"
                  cursor="pointer"
                  align="center"
                  justify="flex-start"
                  onClick={() =>
                    openTxInExplorer(fill.txid || "", explorer, cluster)
                  }
                >
                  <Text mr={1 / 2} opacity="disabled">
                    {i + 1}.
                  </Text>
                  <Text mr={1 / 2} c="primary">
                    {formatPubkey(fill.txid)}
                  </Text>
                  <Icon name="open-outline" c="primary" fontSize="xs" />
                </Flex>
                <Flex w="50%" align="center" justify="flex-end">
                  <Text>
                    {formatNumberToString(
                      +fill[
                        isViewingByBase
                          ? "base_units_filled"
                          : "quote_units_filled"
                      ]
                    )}
                  </Text>
                </Flex>
              </Flex>
            ))}
        </Flex>
      )}
    </Flex>
  );
}
