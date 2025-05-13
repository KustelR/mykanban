import { configureStore } from "@reduxjs/toolkit";
import kanbanReducer from "./features/kanban/kanbanSlice";
import settingsReducers from "./features/kanban/settingsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      kanban: kanbanReducer,
      settings: settingsReducers,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
