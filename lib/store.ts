import type { CryptoHolding } from "@/types/holding";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OrderedHoldingData {
  id: string;
  name: string;
  symbol: string;
  image?: string;
}

import type { SortingState } from "@tanstack/react-table";

interface UserSettings {
  useImageFallback: boolean;
  toggleImageFallback: () => void;
}

interface PortfolioStore {
  holdings: CryptoHolding[];
  isAddHoldingDialogOpen: boolean;
  hoveredSymbol: string | null;
  orderedHoldings: OrderedHoldingData[];
  tableSorting: SortingState;
  tableGlobalFilter: string;

  addHolding: (holding: CryptoHolding) => void;
  removeHolding: (id: string) => void;
  updateHolding: (id: string, updates: Partial<CryptoHolding>) => void;
  openAddHoldingDialog: () => void;
  closeAddHoldingDialog: () => void;
  setHoveredSymbol: (symbol: string | null) => void;
  setOrderedHoldings: (holdings: OrderedHoldingData[]) => void;
  setTableSorting: (sorting: SortingState) => void;
  setTableGlobalFilter: (filter: string) => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      holdings: [],
      isAddHoldingDialogOpen: false,
      hoveredSymbol: null,
      orderedHoldings: [],
      tableSorting: [],
      tableGlobalFilter: "",

      addHolding: (holding) =>
        set((state) => ({
          holdings: [...state.holdings, holding],
        })),
      removeHolding: (id) =>
        set((state) => ({
          holdings: state.holdings.filter((h) => h.id !== id),
        })),
      updateHolding: (id, updates) =>
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.id === id ? { ...h, ...updates } : h,
          ),
        })),
      openAddHoldingDialog: () => set({ isAddHoldingDialogOpen: true }),
      closeAddHoldingDialog: () => set({ isAddHoldingDialogOpen: false }),
      setHoveredSymbol: (symbol) => set({ hoveredSymbol: symbol }),
      setOrderedHoldings: (holdings) => set({ orderedHoldings: holdings }),
      setTableSorting: (sorting) => set({ tableSorting: sorting }),
      setTableGlobalFilter: (filter) => set({ tableGlobalFilter: filter }),
    }),
    {
      name: "crypto-portfolio",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              ![
                "hoveredSymbol",
                "isAddHoldingDialogOpen",
                "orderedHoldings",
              ].includes(key),
          ),
        ),
    },
  ),
);
