import { createAction, createSlice, nanoid } from "@reduxjs/toolkit";

const initialState: KanbanState = {
  columns: [],
  name: "Unknown",
};

const addColumnAction = createAction<ColData>("kanban/addColumn");
const setKanbanAction = createAction<KanbanState>("kanban/setKanban");
const addCardByColIdAction = createAction<[string, CardData]>(
  "kanban/addCardByColId",
);
const replaceCardAction =
  createAction<[string, string, CardData]>("kanban/replaceCard");

export const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    setKanban: (state, action) => {
      const payload = action.payload as KanbanState;
      state.columns = payload.columns;
      state.name = payload.name;
    },
    addColumn: (state, action) => {
      const payload = action.payload as ColData;
      const id = nanoid();
      const cards = payload.cards.map((card) => {
        return { ...card, colId: id };
      });
      state.columns = state.columns.concat({
        ...payload,
        cards: cards,
        id: id,
      });
    },
    addCardByColId: (state, action) => {
      const payload = action.payload as [string, CardData];
      const targetColIdx = state.columns.findIndex(
        (column) => column.id === payload[0],
      );
      const targetCol = { ...state.columns[targetColIdx] };
      if (!targetCol) return;
      targetCol.cards.push(payload[1]);

      const stateClone = { ...state };
      stateClone.columns.splice(targetColIdx, 1, targetCol);
      state = stateClone;
    },
    replaceCard: (state, action) => {
      const payload = action.payload as [string, string, CardData];
      const targetColIdx = state.columns.findIndex((column) => {
        return column.id === payload[0];
      });
      const targetCol = { ...state.columns[targetColIdx] };
      if (!targetCol) return;
      const targetCardIdx = targetCol.cards.findIndex((card) => {
        return card.id === payload[1];
      });
      targetCol.cards.splice(targetCardIdx, 1, payload[2]);

      const stateClone = { ...state };
      stateClone.columns.splice(targetColIdx, 1, targetCol);
      state = stateClone;
    },
  },
});

export {
  addColumnAction,
  addCardByColIdAction,
  replaceCardAction,
  setKanbanAction,
};
export default kanbanSlice.reducer;
