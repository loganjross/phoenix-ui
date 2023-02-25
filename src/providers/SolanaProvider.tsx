import { createContext, useContext, useEffect, useState } from "react";
import { Cluster, Connection } from "@solana/web3.js";
import { useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import {
  BackpackWalletAdapter,
  CoinbaseWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { DEFAULT_RPC_ENDPOINTS, useSettings } from "./SettingsProvider";

const SolanaContext = createContext<{
  cluster: Cluster;
  connection: Connection;
}>({
  cluster: "mainnet-beta",
  connection: new Connection(DEFAULT_RPC_ENDPOINTS["mainnet-beta"]),
});

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const {
    settings: { rpcEndpoint },
  } = useSettings();
  const [cluster, setCluster] = useState<Cluster>("mainnet-beta");
  const [connection, setConnection] = useState<Connection>(
    new Connection(rpcEndpoint.connected)
  );

  useEffect(() => {
    const cluster = rpcEndpoint.connected.includes("devnet")
      ? "devnet"
      : "mainnet-beta";
    setCluster(cluster);

    const connection = new Connection(rpcEndpoint.connected);
    setConnection(connection);
  }, [rpcEndpoint.connected]);

  const wallets = [
    new BackpackWalletAdapter(),
    new CoinbaseWalletAdapter(),
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter(),
    new SolongWalletAdapter(),
    new TorusWalletAdapter(),
  ];

  return (
    <SolanaContext.Provider
      value={{
        cluster,
        connection,
      }}
    >
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </SolanaContext.Provider>
  );
}

export function useSolana() {
  const context = useContext(SolanaContext);
  const {
    wallets: options,
    select,
    wallet,
    connected,
    publicKey,
    sendTransaction,
    signTransaction,
    signAllTransactions,
  } = useWallet();

  return {
    ...context,
    wallet: {
      options,
      select,
      name: wallet?.adapter.name || null,
      publicKey: connected && publicKey ? publicKey : null,
      sendTransaction,
      signTransaction,
      signAllTransactions,
    },
  };
}
