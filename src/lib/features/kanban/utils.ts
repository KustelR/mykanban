import { EnhancedStore } from "@reduxjs/toolkit";

export function getCard(
  state: KanbanState,
  id: string,
): { cardIdx: number; columnIdx: number; card: CardData } {
  const columns = [...state.columns];
  const colIdx = state.columns.findIndex(
    (col) => col.cards && col.cards.filter((card) => card.id === id).length > 0,
  );
  const column = columns[colIdx];
  if (!column.cards) throw new Error("Card not found");

  const cardIdx = column.cards.findIndex((c) => c.id === id);
  if (cardIdx === -1 || colIdx === -1) throw new Error("Card not found");

  const card = column.cards[cardIdx];
  if (!card) throw new Error("Card not found");

  return { cardIdx, columnIdx: colIdx, card };
}
