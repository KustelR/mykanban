import {
  createAction,
  createReducer,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";

const initialState: KanbanState = {
  columns: [],
  label: "Unknown",
};

const addColumnAction = createAction<ColData>("kanban/addColumn");

export const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    addColumn: (state, action) => {
      state.columns = state.columns.concat({ ...action.payload, id: nanoid() });
    },
  },
});

export { addColumnAction };
export default kanbanSlice.reducer;
