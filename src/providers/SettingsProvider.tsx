import { createContext, useContext } from "react";
import { Cluster } from "@solana/web3.js";
import * as Phoenix from "@ellipsis-labs/phoenix-sdk";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { Explorer, explorerOptions } from "../utils/explore";
import { ThemeMode } from "../styles/theme";

const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname.includes("vercel");
const RPC_TOKEN = process.env.REACT_APP_RPC_TOKEN || "";
const RPC_DEVNET_TOKEN = process.env.REACT_APP_RPC_DEVNET_TOKEN || "";
if (isDevelopment && (!RPC_TOKEN || !RPC_DEVNET_TOKEN)) {
  throw Error(
    "REACT_APP_RPC_TOKEN OR REACT_APP_RPC_DEVNET_TOKEN undefined, please them to the .env file."
  );
}

export const DEFAULT_RPC_ENDPOINTS: Record<Cluster, string> = {
  "mainnet-beta": `https://ellipsis-main-98a6.mainnet.rpcpool.com/${
    isDevelopment ? RPC_TOKEN : ""
  }`,
  devnet: `https://ellipsis-develope-cbc0.devnet.rpcpool.com/${
    isDevelopment ? RPC_DEVNET_TOKEN : ""
  }`,
  testnet: "https://api.testnet.solana.com",
};

interface SwapSettings {
  slippage: number;
  priorityFee: number;
}

interface Settings {
  themeMode: ThemeMode;
  rpcEndpoint: {
    connected: string;
    custom: string;
  };
  explorer: Explorer;
  swapSettings: SwapSettings;
}

const SettingsContext = createContext<{
  settings: Settings;
  updateSetting: (setting: keyof Settings, value: any) => void;
}>({
  settings: {} as Settings,
  updateSetting: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useLocalStorage<ThemeMode>(
    "preferredThemeMode",
    "dark"
  );
  const [rpcEndpoint, setRpcEndpoint] = useLocalStorage(
    "preferredRpcEndpoint",
    {
      connected: DEFAULT_RPC_ENDPOINTS["mainnet-beta"],
      custom: "",
    }
  );
  const [explorer, setExplorer] = useLocalStorage<Explorer>(
    "preferredExplorer",
    explorerOptions[0].name
  );
  const [swapSettings, setSwapSettings] = useLocalStorage<SwapSettings>(
    "preferredSwapSettings",
    {
      slippage: Phoenix.DEFAULT_SLIPPAGE_PERCENT,
      priorityFee: 0,
    }
  );

  function updateSetting(setting: keyof Settings, value: any) {
    switch (setting) {
      case "themeMode":
        setThemeMode(value);
        break;
      case "rpcEndpoint":
        setRpcEndpoint(value);
        break;
      case "explorer":
        setExplorer(value);
        break;
      case "swapSettings":
        setSwapSettings(value);
        break;
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings: {
          themeMode,
          rpcEndpoint,
          explorer,
          swapSettings,
        },
        updateSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
