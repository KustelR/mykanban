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
const setKanbanMetaAction = createAction<{ name: string; tags: TagData[] }>(
  "kanban/setKanbanMeta",
);
const setTagsAction = createAction<TagData[]>("kanban/setTags");
const setCardTagsAction = createAction<{ cardId: string; tagIds: string[] }>(
  "kanban/setCardTags",
);
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
    setKanbanMeta: (state, action) => {
      const { name, tags } = action.payload as {
        name: string;
        tags: TagData[];
      };
      state.name = name;
      state.tags = tags;
    },
    setCardTags: (state, action) => {
      const { cardId, tagIds } = action.payload as {
        cardId: string;
        tagIds: string[];
      };
      const colIdx = state.columns.findIndex((col) =>
        col.cards?.filter((card) => card.id === cardId),
      );
      const cardIdx = state.columns[colIdx].cards?.findIndex(
        (c) => (c.id = cardId),
      );
      if (!cardIdx || !state.columns[colIdx].cards) return;
      const card = state.columns[colIdx].cards[cardIdx];
      state.columns[colIdx].cards?.splice(cardIdx, 1, {
        ...card,
        tagIds: tagIds,
      });
    },
  },
});

function updateKanbanMeta(
  dispatch: any,
  store: EnhancedStore,
  data: { name: string; tags: TagData[] },
) {
  dispatch(setKanbanMetaAction(data));
  dispatch(
    updateLastChanged([
      { ...store.getState().kanban, name: data.name, tags: data.tags },
      "kanban/setKanbanMeta",
    ]),
  );
}
function updateCardTags(
  dispatch: any,
  store: EnhancedStore,
  id: string,
  data: TagData[],
) {}
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

export {
  setTagsAction,
  updateKanban,
  updateTags,
  updateKanbanMeta,
  updateCardTags,
};
export default kanbanSlice.reducer;
