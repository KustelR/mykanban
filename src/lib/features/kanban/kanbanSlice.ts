import { createAction, createSlice, EnhancedStore } from "@reduxjs/toolkit";
import { updateLastChanged } from "../lastChanged/lastChangedSlice";
import { getCard, getColumn } from "./utils";

const initialState: KanbanState = {
  columns: [],
  name: "default_12543",
  tags: [],
};

const setKanbanAction = createAction<KanbanState>("kanban/setKanban");
const setKanbanMetaAction = createAction<{ name: string; tags: TagData[] }>(
  "kanban/setKanbanMeta",
);
const pushCardAction = createAction<{ columnId: string; card: CardData }>(
  "kanban/pushCard",
);
const setTagsAction = createAction<TagData[]>("kanban/setTags");
const setColumnCardsAction = createAction<{ id: string; cards: CardData[] }>(
  "kanban/setColumnCards",
);
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
    setColumnCards: (state, action) => {
      const { id, cards } = action.payload as { id: string; cards: CardData[] };
      const { idx, column } = getColumn(state, id);
      state.columns.splice(idx, 1, { ...column, cards: cards });
    },
    pushCard: (state, action) => {
      const { columnId, card } = action.payload as {
        columnId: string;
        card: CardData;
      };
      const { idx, column } = getColumn(state, columnId);
      const cards = column.cards ? column.cards : [];
      state.columns.splice(idx, 1, {
        ...column,
        cards: [
          ...cards,
          { ...card, order: cards.length, columnId: column.id },
        ],
      });
      state.lastAction = "push_card";
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

function updateColumnCards(
  dispatch: AppDispatch,
  store: EnhancedStore,
  id: string,
  data: CardData[],
) {
  dispatch(setColumnCardsAction({ id: id, cards: data }));
  dispatch(
    updateLastChanged([store.getState().kanban, "kanban/setColumnCards"]),
  );
}

export {
  setTagsAction,
  updateKanban,
  updateTags,
  updateKanbanMeta,
  updateCardTags,
  updateColumnCards,
  pushCardAction,
};
export default kanbanSlice.reducer;
