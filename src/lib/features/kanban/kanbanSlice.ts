import { createAction, createSlice, EnhancedStore } from "@reduxjs/toolkit";
import { getCard, getColumn } from "./utils";

const initialState: KanbanState = {
  id: "",
  columns: [],
  name: "",
  tags: [],
  createdAt: 0,
  updatedAt: 0,
  createdBy: "",
  updatedBy: "",
};

const setKanbanAction = createAction<KanbanState>("kanban/setKanban");
const setProjectDataAction = createAction<{ name: string; tags: TagData[] }>(
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

      return payload;
    },
    setTags: (state, action) => {
      const payload = action.payload as TagData[];
      state.tags = payload;
      state.lastAction = "set_tags";
    },
    setKanbanMeta: (state, action) => {
      const { name, tags } = action.payload as {
        name: string;
        tags: TagData[];
      };
      state.name = name;
      state.tags = tags;
      state.lastAction = "set_project_data";
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
      state.lastAction = "set_card_tags";
    },
    setColumnCards: (state, action) => {
      const { id, cards } = action.payload as { id: string; cards: CardData[] };
      const { idx, column } = getColumn(state, id);
      state.columns.splice(idx, 1, { ...column, cards: cards });
      state.lastAction = "set_cards";
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
        cards: [...cards, { ...card }],
      });
      state.lastAction = "push_card";
    },
  },
});

export {
  setColumnCardsAction,
  setKanbanAction,
  setProjectDataAction,
  setCardTagsAction,
  setTagsAction,
  pushCardAction,
};
export default kanbanSlice.reducer;
