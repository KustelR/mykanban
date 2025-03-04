import { createAction, createSlice, nanoid } from "@reduxjs/toolkit";
import objectHash from "object-hash";

const initialState: LastChangedState = {
  timestamp: Date.now(),
  hash: "",
  lastAction: "",
};

const updateLastChanged = createAction<[KanbanState, string]>(
  "lastChanged/updateLastChanged",
);
export const kanbanSlice = createSlice({
  name: "lastChanged",
  initialState,
  reducers: {
    updateLastChanged: (state, action) => {
      const [project, lastAction] = action.payload as [KanbanState, string];
      return {
        timestamp: Date.now(),
        hash: objectHash(project),
        lastAction: lastAction,
      };
    },
  },
});

export { updateLastChanged };
export default kanbanSlice.reducer;
