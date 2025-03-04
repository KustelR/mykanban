import { createAction, createSlice, nanoid } from "@reduxjs/toolkit";

const initialState: KanbanState = {
  columns: [],
  name: "default_12543",
  tags: [],
};

const setKanbanAction = createAction<KanbanState>("kanban/setKanban");
const setTagsAction = createAction<TagData[]>("kanban/setTags");
export const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    setKanban: (state, action) => {
      const payload = action.payload as KanbanState;
      state.columns = payload.columns;
      state.name = payload.name;
      state.tags = payload.tags;
    },
    setTags: (state, action) => {
      const payload = action.payload as TagData[];
      state.tags = payload;
    },
  },
});

export { setKanbanAction, setTagsAction };
export default kanbanSlice.reducer;
