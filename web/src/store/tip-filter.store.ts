import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TipFilterState {
  search: string;
  tags: string[];
  sort: "newest" | "popular";
  page: number;

  setSearch: (search: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setSort: (sort: "newest" | "popular") => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useTipFilterStore = create<TipFilterState>()(
  persist(
    (set) => ({
      search: "",
      tags: [],
      sort: "newest",
      page: 1,

      setSearch: (search) => set({ search }),
      addTag: (tag) =>
        set((state) => ({
          tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag],
        })),
      removeTag: (tag) =>
        set((state) => ({
          tags: state.tags.filter((t) => t !== tag),
        })),
      setSort: (sort) => set({ sort }),
      setPage: (page) => set({ page }),
      resetFilters: () =>
        set({ search: "", tags: [], sort: "newest", page: 1 }),
    }),
    {
      name: "tip-filters",
    }
  )
);
