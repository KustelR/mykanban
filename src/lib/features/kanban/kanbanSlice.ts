import {
  createAction,
  createSlice,
  EnhancedStore,
  nanoid,
} from "@reduxjs/toolkit";
import { updateLastChanged } from "../lastChanged/lastChangedSlice";

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

function updateKanban(dispatch: any, data: KanbanState) {
  dispatch(setKanbanAction(data));
  dispatch(updateLastChanged([data, "kanban/setKanban"]));
}
function updateTags(dispatch: any, store: EnhancedStore, data: TagData[]) {
  dispatch(setTagsAction(data));
  dispatch(
    updateLastChanged([
      { ...store.getState().kanban, tags: data },
      "kanban/setTags",
    ]),
  );
}

export { setTagsAction, updateKanban, updateTags };
export default kanbanSlice.reducer;
