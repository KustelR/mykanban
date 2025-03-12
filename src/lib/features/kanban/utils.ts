import { EnhancedStore } from "@reduxjs/toolkit";

export function getCard(
  state: KanbanState,
  id: string,
): { cardIdx: number; columnIdx: number; card: CardData } {
  const columns = [...state.columns];
  const colIdx = columns.findIndex(
    (col) => col.cards && col.cards.filter((card) => card.id === id).length > 0,
  );
  const column = columns[colIdx];
  if (!column.cards) throw new Error("Card not found");

  const cardIdx = column.cards.findIndex((c) => c.id === id);
  if (cardIdx === -1 || colIdx === -1) throw new Error("Card not found");

  const card = column.cards[cardIdx];

  return { cardIdx, columnIdx: colIdx, card: { ...card } };
}
export function getColumn(
  state: KanbanState,
  id: string,
): { idx: number; column: ColData } {
  const columns = [...state.columns];
  const colIdx = columns.findIndex(
    (col) => col.cards && col.cards.filter((card) => card.id === id).length > 0,
  );
  if (colIdx === -1) throw new Error("Column was not found");
  const column = columns[colIdx]
  return {idx: colIdx, column: {...column}}
}
