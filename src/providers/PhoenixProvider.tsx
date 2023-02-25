import { useSearchParams } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import * as Phoenix from "@ellipsis-labs/phoenix-sdk";

import { useSolana } from "./SolanaProvider";

const POLLING_INTERVAL = 1500;

const PhoenixContext = createContext<{
  isLoading: boolean;
  client: Phoenix.Client | null;
  currentMarket: Phoenix.Market | null;
  changeMarket: (marketAddress: string) => void;
}>({
  isLoading: true,
  client: null,
  currentMarket: null,
  changeMarket: () => {},
});

export function PhoenixProvider({ children }: { children: React.ReactNode }) {
  const [params, setParams] = useSearchParams();
  const marketAddressParam = params.get("market");
  const {
    cluster,
    connection,
    wallet: { publicKey },
  } = useSolana();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [client, setClient] = useState<Phoenix.Client | null>(null);
  const [currentMarket, setCurrentMarket] = useState<Phoenix.Market | null>(
    null
  );

  function changeMarket(marketAddress: string) {
    if (!client) return;

    const market = client.markets.find(
      (m) => m.address.toBase58() === marketAddress
    );
    setCurrentMarket(market || null);
    setParams((params) => ({
      ...params,
      market: marketAddress,
    }));
  }

  // Set initial market address
  useEffect(() => {
    if (!client?.markets || !!currentMarket) return;

    const marketAddress = (
      client.markets.find(
        (m) =>
          m.address.toBase58() === marketAddressParam || m.name === "wSOL/USDC"
      ) || client.markets[0]
    ).address.toBase58();

    changeMarket(marketAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client?.markets, currentMarket]);

  // On cluster change, set market
  useEffect(() => {
    if (!client?.markets || !currentMarket) return;

    const marketAddress = (
      client.markets.find((m) => m.name === "wSOL/USDC") || client.markets[0]
    ).address.toBase58();

    changeMarket(marketAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client?.markets, cluster]);

  // Create a Phoenix client on init and cluster/wallet change
  useEffect(() => {
    setIsLoading(true);
    Phoenix.Client.create(connection, publicKey || undefined)
      .then((client) => {
        setClient(client);
        setIsLoading(false);
      })
      .catch((err) => console.log("Error creating Phoenix client: ", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cluster, publicKey]);

  // Poll for client updates
  useEffect(() => {
    async function refreshClient() {
      if (!client) return;

      await Promise.all(
        client.markets.map(async (market: Phoenix.Market) => {
          const refreshedMarket = await market.refresh(connection);
          client.markets[
            client.markets.findIndex(
              (m) => m.address.toBase58() === refreshedMarket.address.toBase58()
            )
          ] = refreshedMarket;
        })
      );

      if (client.trader) {
        const refreshedTrader = await client.trader.refresh(connection);
        client.trader = refreshedTrader;
      }

      setClient({ ...client });
    }

    const clientRefreshInterval = setInterval(refreshClient, POLLING_INTERVAL);
    return () => clearInterval(clientRefreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cluster, client]);

  return (
    <PhoenixContext.Provider
      value={{
        isLoading,
        client,
        currentMarket,
        changeMarket,
      }}
    >
      {children}
    </PhoenixContext.Provider>
  );
}

export function usePhoenix() {
  return useContext(PhoenixContext);
}
