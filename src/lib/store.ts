import { configureStore } from "@reduxjs/toolkit";
import kanbanReducer from "./features/kanban/kanbanSlice";
import projectIdReducer from "./features/projectId/projectIdSlice";
import lastChangedReducer from "./features/lastChanged/lastChangedSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      kanban: kanbanReducer,
      lastChanged: lastChangedReducer,
      projectId: projectIdReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
