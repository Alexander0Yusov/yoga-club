import { StateCreator } from "zustand";

export interface ToggleFormSlice {
  isFormEventOpen: boolean;
  setIsFormEventOpen: (value: boolean) => void;
}

export const toggleFormSlice: StateCreator<
  ToggleFormSlice,
  [],
  [],
  ToggleFormSlice
> = (set) => ({
  isFormEventOpen: false,
  setIsFormEventOpen: (value: boolean) => set({ isFormEventOpen: value }),
});
