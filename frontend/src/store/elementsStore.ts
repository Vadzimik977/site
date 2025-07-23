import { create } from "zustand";
import { IPlanetElement } from "../types/planets.type";

interface IElementsStore {
  planetElements: IPlanetElement[];
  setPlanetElements: (elements: IPlanetElement[]) => void;
}

export const useElementsStore = create<IElementsStore>((set) => ({
  planetElements: [],
  setPlanetElements: (elements) => set({ planetElements: elements }),
}));
