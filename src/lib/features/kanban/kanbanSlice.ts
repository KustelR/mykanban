import { createAction, createSlice, nanoid } from "@reduxjs/toolkit";

const initialState: KanbanState = {
  columns: [],
  name: "default_12543",
  tags: [],
};

const setKanbanAction = createAction<KanbanState>("kanban/setKanban");
export const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    setKanban: (state, action) => {
      const payload = action.payload as KanbanState;
      state.columns = payload.columns;
      state.name = payload.name;
    },
  },
});

export { setKanbanAction };
export default kanbanSlice.reducer;
