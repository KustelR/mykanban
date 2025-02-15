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
const addCardByColIdAction = createAction<[string, CardData]>(
  "kanban/addCardByColId",
);

export const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
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
      state.columns.splice(targetColIdx, 1, targetCol);
    },
  },
});

export { addColumnAction, addCardByColIdAction };
export default kanbanSlice.reducer;
