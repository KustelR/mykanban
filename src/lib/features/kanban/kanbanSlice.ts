import {
  createAction,
  createSlice,
  Dispatch,
  EnhancedStore,
  nanoid,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import { updateLastChanged } from "../lastChanged/lastChangedSlice";
import { getCard } from "./utils";

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
const setCardTagsAction = createAction<{ cardId: string; tags: string[] }>(
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
      const { cardId, tags } = action.payload as {
        cardId: string;
        tags: string[];
      };

      const { cardIdx, columnIdx, card } = getCard(state, cardId);
      state.columns[columnIdx].cards?.splice(cardIdx, 1, {
        ...card,
        tagIds: tags,
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
  dispatch: AppDispatch,
  store: EnhancedStore,
  id: string,
  data: string[],
) {
  dispatch(setCardTagsAction({ cardId: id, tags: data }));
  dispatch(updateLastChanged([store.getState().kanban, "kanban/setCardTags"]));
}
function updateKanban(dispatch: AppDispatch, data: KanbanState) {
  dispatch(setKanbanAction(data));
  dispatch(updateLastChanged([data, "kanban/setKanban"]));
}
function updateTags(
  dispatch: AppDispatch,
  store: EnhancedStore,
  data: TagData[],
) {
  dispatch(setTagsAction(data));
  dispatch(updateLastChanged([store.getState().kanban, "kanban/setTags"]));
}

export {
  setTagsAction,
  updateKanban,
  updateTags,
  updateKanbanMeta,
  updateCardTags,
};
export default kanbanSlice.reducer;
