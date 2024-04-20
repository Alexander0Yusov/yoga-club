import { StateCreator } from "zustand";

// Тип данных для события
type Event = {
  title: string;
  date: string;
};

// Интерфейс для EventsSlice
export interface EventsSlice {
  events: Event[];
  addEvent: (newEvent: Event) => void;
}

// Создание EventsSlice
export const createEventsSlice: StateCreator<
  EventsSlice,
  [],
  [],
  EventsSlice
> = (set) => ({
  events: [],
  addEvent: (newEvent: Event) =>
    set((state) => ({ events: [...state.events, newEvent] })),
});
