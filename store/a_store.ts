// user slice
// events slice
// feedbacks slice

// у пользователя должен храниться промис. значение промиса можно получить в компоненте и на нем играть тостами

import { create } from "zustand";

import { createUserSlice, UserSlice } from "@/store/userSlice";
import { createEventsSlice, EventsSlice } from "./feedbacksSlice";
import { toggleFormSlice, ToggleFormSlice } from "./toggleFormSlice";

// Создание хранилища Zustand
const useStore = create<UserSlice & EventsSlice & ToggleFormSlice>()(
  (...a) => ({
    ...createUserSlice(...a),
    ...createEventsSlice(...a),
    ...toggleFormSlice(...a),
  })
);

export default useStore;
