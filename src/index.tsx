import { Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { SettingsProvider, useSettings } from "./providers/SettingsProvider";
import { SolanaProvider } from "./providers/SolanaProvider";
import { PhoenixProvider } from "./providers/PhoenixProvider";
import { ModalsProvider } from "./providers/ModalsProvider";
import { DataProvider } from "./providers/DataProvider";
import { getTheme } from "./styles/theme";
import { GlobalStyles } from "./styles/global";
import { Nav, Footer, Notifications } from "./components/Layout";
import { Modals } from "./components/Modals";
import { Home } from "./views/Home";
import { Swap } from "./views/Swap";
import { Data } from "./views/Data";

function ThemedApp() {
  const {
    settings: { themeMode },
  } = useSettings();

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <GlobalStyles />
      <ModalsProvider>
        <Nav />
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route index path="/swap" element={<Swap />} />
          <Route index path="/data" element={<Data />} />
        </Routes>
        <Modals />
        <Notifications />
        <Footer />
      </ModalsProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <SettingsProvider>
      <SolanaProvider>
        <PhoenixProvider>
          <DataProvider>
            <ThemedApp />
          </DataProvider>
        </PhoenixProvider>
      </SolanaProvider>
    </SettingsProvider>
  </BrowserRouter>
);
