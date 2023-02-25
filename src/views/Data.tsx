import { useTheme } from "styled-components";

import { usePhoenix } from "../providers/PhoenixProvider";
import { useData } from "../providers/DataProvider";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { Flex } from "../components/Layout";
import { Toggle } from "../components/Fields";
import {
  DataParameters,
  Orderbook,
  FillsTable,
  TopMakersTable,
  PriceHistoryChart,
  VolumeHistoryChart,
  MarketMeta,
  TopFillsTable,
} from "../components/Data";

export function Data() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.view.breakpoint.mobile);
  const { currentMarket } = usePhoenix();
  const {
    currentTab,
    setCurrentTab,
    currentMarketData,
    currentTraderAddress,
    currentTraderData,
  } = useData();

  return (
    <Flex
      w="95%"
      maxW={theme.view.gutter + "px"}
      mx="auto"
      centered
      wrapped
      column
    >
      <Toggle
        mt={1}
        mb={3}
        options={[
          {
            label: "Market",
            isActive: currentTab === "market",
            onClick: () => setCurrentTab("market"),
          },
          {
            label: "Trader",
            isActive: currentTab === "trader",
            onClick: () => setCurrentTab("trader"),
          },
        ]}
      />
      <DataParameters showTraderInput={currentTab === "trader"} />
      {currentTab === "market" ? (
        <Flex w="100%" column>
          <Flex
            w="100%"
            align={isSmallScreen ? "center" : undefined}
            justify="space-between"
            column={isSmallScreen}
          >
            <Orderbook
              bids={currentMarketData?.orderbook.bids || []}
              asks={currentMarketData?.orderbook.asks || []}
            />
            <Flex w="100%" column>
              <VolumeHistoryChart
                w="100%"
                h="150px"
                volumeHistory={currentMarketData?.volume || []}
              />
              <PriceHistoryChart w="100%" h="150px" />
            </Flex>
          </Flex>
          <Flex
            w="100%"
            h={isSmallScreen ? "auto" : "350px"}
            pb={isSmallScreen ? undefined : 2}
            centered={isSmallScreen}
            justify="space-between"
            column={isSmallScreen}
          >
            <MarketMeta market={currentMarket} />
            <TopFillsTable
              topFills={currentMarketData?.topFills || { base: [], quote: [] }}
            />
            <TopMakersTable topMakers={currentMarketData?.topMakers || []} />
          </Flex>
        </Flex>
      ) : (
        <VolumeHistoryChart
          w="100%"
          h="150px"
          volumeHistory={currentTraderData?.volume || []}
          noData={
            !currentTraderAddress ||
            (!!currentTraderAddress && !currentTraderData?.volume)
          }
        />
      )}
      <FillsTable
        fills={
          (currentTab === "market"
            ? currentMarketData?.fills
            : currentTraderData?.fills) || []
        }
        noData={
          currentTab === "trader" &&
          (!currentTraderAddress ||
            (!!currentTraderAddress && !currentTraderData?.fills))
        }
      />
    </Flex>
  );
}
