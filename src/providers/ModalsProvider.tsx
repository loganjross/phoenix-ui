import { createContext, useContext, useState } from "react";

type Modals =
  | "connect-wallet"
  | "settings"
  | "swap-settings"
  | "token-select"
  | "market-select"
  | "geobanned";

const ModalsContext = createContext<{
  currentOpenModals: Array<Modals>;
  openModal: (modal: Modals) => void;
  closeModal: (modal: Modals) => void;
}>({ currentOpenModals: [], openModal: () => {}, closeModal: () => {} });

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const [currentOpenModals, setCurrentOpenModals] = useState<Array<Modals>>([]);

  const openModal = (modal: Modals) => {
    setCurrentOpenModals((currentOpenModals) => [...currentOpenModals, modal]);
  };

  const closeModal = (modal: Modals) => {
    setCurrentOpenModals((currentOpenModals) =>
      currentOpenModals.filter((currentModal) => currentModal !== modal)
    );
  };

  return (
    <ModalsContext.Provider
      value={{
        currentOpenModals,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
}

export function useModals() {
  return useContext(ModalsContext);
}
