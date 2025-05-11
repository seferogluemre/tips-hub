import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TipFilterState {
  search: string;
  tag: string;
  sort: "newest" | "popular";
  page: number;

  // Actions
  setSearch: (search: string) => void;
  setTag: (tag: string) => void;
  setSort: (sort: "newest" | "popular") => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useTipFilterStore = create<TipFilterState>()(
  persist(
    (set) => ({
      search: "",
      tag: "",
      sort: "newest",
      page: 1,

      setSearch: (search) => set({ search }),
      setTag: (tag) => set({ tag }),
      setSort: (sort) => set({ sort }),
      setPage: (page) => set({ page }),
      resetFilters: () => set({ search: "", tag: "", sort: "newest", page: 1 }),
    }),
    {
      name: "tip-filters",
    }
  )
);
