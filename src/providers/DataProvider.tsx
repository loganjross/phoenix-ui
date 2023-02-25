import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { usePhoenix } from "./PhoenixProvider";
import { fetchApiMarketData, fetchApiTraderData } from "../utils/dataApi";
import { useSolana } from "./SolanaProvider";
import { Path } from "../components/Layout";

export const LONG_API_POLLING_INTERVAL = 10000;
export const MEDIUM_API_POLLING_INTERVAL = 5000;
export const SHORT_API_POLLING_INTERVAL = 1000;

export type DataTab = "market" | "trader";

interface FillData {
  base_atoms_filled: string;
  base_lots_filled: string;
  base_units_filled: string;
  fees_paid_in_quote_atoms: string;
  maker: string;
  market_id: number;
  price: string;
  price_in_ticks: string;
  quote_atoms_filled: string;
  quote_lots_filled: string;
  quote_units_filled: string;
  sequence_number: string;
  taker: string;
  trade_direction: number;
  txid: string;
  unix_timestamp: string;
}

interface VolumeData {
  time: string;
  volume_in_quote_units: string;
}

export interface ApiMarketData {
  volume: Array<VolumeData>;
  orderbook: {
    bids: Array<Array<number | string>>;
    asks: Array<Array<number | string>>;
  };
  fills: Array<FillData>;
  topFills: {
    base: Array<FillData>;
    quote: Array<FillData>;
  };
  priceHistory: Array<{
    price: string;
    unix_timestamp: string;
  }>;
  topMakers: Array<{
    maker: string;
    total_volume: string;
  }>;
}

export interface ApiTraderData {
  volume: Array<VolumeData>;
  fills: Array<FillData>;
}

const DataContext = createContext<{
  currentTab: DataTab;
  setCurrentTab: (tab: DataTab) => void;
  currentTraderAddress: string;
  setCurrentTraderAddress: (traderAddress: string) => void;
  startTimestamp: number | null;
  setStartTimestamp: (timestamp: number | null) => void;
  endTimestamp: number | null;
  setEndTimestamp: (timestamp: number | null) => void;
  currentMarketData: ApiMarketData | null;
  currentTraderData: ApiTraderData | null;
}>({
  currentTab: "market",
  setCurrentTab: () => {},
  currentTraderAddress: "",
  setCurrentTraderAddress: () => {},
  startTimestamp: null,
  setStartTimestamp: () => {},
  endTimestamp: null,
  setEndTimestamp: () => {},
  currentMarketData: null,
  currentTraderData: null,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const traderAddress = params.get("trader");
  const { cluster } = useSolana();
  const { currentMarket } = usePhoenix();
  // Params
  const [currentTab, setCurrentTab] = useState<DataTab>(
    traderAddress ? "trader" : "market"
  );
  const currentMarketAddress = currentMarket?.address.toBase58() || "";
  const [currentTraderAddress, setCurrentTraderAddress] = useState(
    traderAddress || ""
  );
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [endTimestamp, setEndTimestamp] = useState<number | null>(null);
  // Market data
  const [volume, setVolume] = useState<ApiMarketData["volume"]>([]);
  const [fills, setFills] = useState<ApiMarketData["fills"]>([]);
  const [topFills, setTopFills] = useState<ApiMarketData["topFills"]>({
    base: [],
    quote: [],
  });
  const [orderbook, setOrderbook] = useState<ApiMarketData["orderbook"]>({
    bids: [],
    asks: [],
  });
  const [topMakers, setTopMakers] = useState<ApiMarketData["topMakers"]>([]);
  const [priceHistory, setPriceHistory] = useState<
    ApiMarketData["priceHistory"]
  >([]);
  // Trader data
  const [traderVolume, setTraderVolume] = useState<ApiTraderData["volume"]>([]);
  const [traderFills, setTraderFills] = useState<ApiTraderData["fills"]>([]);

  function resetMarketData() {
    setVolume([]);
    setFills([]);
    setTopFills({
      base: [],
      quote: [],
    });
    setOrderbook({
      bids: [],
      asks: [],
    });
    setTopMakers([]);
    setPriceHistory([]);
  }

  function resetTraderData() {
    setTraderVolume([]);
    setTraderFills([]);
  }

  // Market data
  useEffect(() => {
    if (
      !currentMarketAddress ||
      !(location.pathname === Path.Data && currentTab === "market")
    ) {
      return;
    }
    resetMarketData();

    async function longFetchIntervalMarketData() {
      // Volume
      fetchApiMarketData<ApiMarketData["volume"]>(
        "get-market-volume",
        cluster,
        currentMarketAddress,
        startTimestamp,
        endTimestamp,
        "&time_aggregation=h"
      ).then(setVolume);

      // Top makers
      fetchApiMarketData<ApiMarketData["topMakers"]>(
        "get-top-makers",
        cluster,
        currentMarketAddress,
        startTimestamp,
        endTimestamp
      ).then(setTopMakers);

      // Top trades
      ["base", "quote"].forEach((sortToken) => {
        fetchApiMarketData<ApiMarketData["topFills"]>(
          "get-top-trades",
          cluster,
          currentMarketAddress,
          startTimestamp,
          endTimestamp,
          `&sort_token=${sortToken}`
        ).then((topFills) => {
          setTopFills((prevTopFills) => ({
            ...prevTopFills,
            [sortToken]: topFills,
          }));
        });
      });

      // Price history
      fetchApiMarketData<ApiMarketData["priceHistory"]>(
        "get-historical-prices",
        cluster,
        currentMarketAddress,
        startTimestamp,
        endTimestamp
      ).then(setPriceHistory);
    }

    async function mediumFetchIntervalMarketData() {
      // Fills
      fetchApiMarketData<ApiMarketData["fills"]>(
        "get-market-trade-list",
        cluster,
        currentMarketAddress,
        startTimestamp,
        endTimestamp
      ).then(setFills);
    }

    async function shortFetchIntervalMarketData() {
      // Orderbook
      fetchApiMarketData<ApiMarketData["orderbook"]>(
        "get-top-of-book",
        cluster,
        currentMarketAddress,
        startTimestamp,
        endTimestamp
      ).then(setOrderbook);
    }

    shortFetchIntervalMarketData();
    const shortMarketDataInterval = setInterval(
      shortFetchIntervalMarketData,
      SHORT_API_POLLING_INTERVAL
    );

    mediumFetchIntervalMarketData();
    const mediumMarketDataInterval = setInterval(
      mediumFetchIntervalMarketData,
      MEDIUM_API_POLLING_INTERVAL
    );

    longFetchIntervalMarketData();
    const longMarketDataInterval = setInterval(
      longFetchIntervalMarketData,
      LONG_API_POLLING_INTERVAL
    );

    return () => {
      clearInterval(longMarketDataInterval);
      clearInterval(mediumMarketDataInterval);
      clearInterval(shortMarketDataInterval);
    };
  }, [
    currentTab,
    cluster,
    currentMarketAddress,
    startTimestamp,
    endTimestamp,
    location.pathname,
  ]);

  // Trader data
  useEffect(() => {
    if (
      !currentMarketAddress ||
      !currentTraderAddress ||
      !(location.pathname === Path.Data && currentTab === "trader")
    ) {
      return;
    }
    resetTraderData();
    setParams((params) => ({
      ...params,
      market: currentMarketAddress,
      trader: currentTraderAddress,
    }));

    async function longFetchTraderData() {
      // Volume
      fetchApiTraderData<any>(
        "get-volume-for-trader",
        cluster,
        currentTraderAddress,
        currentMarketAddress,
        startTimestamp,
        endTimestamp,
        "&time_aggregation=h"
      ).then(setTraderVolume);

      // Fills
      fetchApiTraderData<any>(
        "get-trade-history",
        cluster,
        currentTraderAddress,
        currentMarketAddress,
        startTimestamp,
        endTimestamp
      ).then(setTraderFills);
    }

    longFetchTraderData();
    const longFetchIntervalTraderData = setInterval(
      longFetchTraderData,
      LONG_API_POLLING_INTERVAL
    );
    return () => clearInterval(longFetchIntervalTraderData);
  }, [
    currentTab,
    cluster,
    currentMarketAddress,
    currentTraderAddress,
    startTimestamp,
    endTimestamp,
    location.pathname,
    params,
    setParams,
  ]);

  return (
    <DataContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        currentTraderAddress,
        setCurrentTraderAddress,
        startTimestamp,
        setStartTimestamp,
        endTimestamp,
        setEndTimestamp,
        currentMarketData: {
          volume,
          orderbook,
          fills,
          topFills,
          topMakers,
          priceHistory,
        },
        currentTraderData: {
          volume: traderVolume,
          fills: traderFills,
        },
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
