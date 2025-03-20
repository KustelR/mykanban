import { setCardTagsAction } from "@/lib/features/kanban/kanbanSlice";
import { getCard } from "@/lib/features/kanban/utils";
import { EnhancedStore, nanoid } from "@reduxjs/toolkit";

/**
 * Gets an array of columns and pushes card to column with specified id
 * @throws If column was not found
 * @returns {Array<ColData>} - changed array
 */
export function pushNewCard(
  card: CardData,
  colId: string,
  columns: Array<ColData>,
): Array<ColData> {
  const newColumns = [...columns];
  const changingColumnIdx = columns.findIndex((col) => {
    return colId === col.id;
  });
  if (changingColumnIdx === -1) throw new Error("No column was found");
  let cards = newColumns[changingColumnIdx].cards;
  if (!cards) cards = [];
  const newColumnCards = [...cards];
  const newCard: CardData = {
    ...card,
    columnId: colId,
    order: cards.length + 1,
  };
  newColumnCards.push(newCard);
  newColumns[changingColumnIdx] = {
    ...newColumns[changingColumnIdx],
    cards: newColumnCards,
  };
  return newColumns;
}

export function removeCard(cards: CardData[], id: string) {
  const card: CardData | undefined = cards.find((card) => {
    return card.id === id;
  });
  if (!card) throw new Error("No card was found");
  cards = cards.map((c) => {
    if (c.order < card.order) return c;
    return { ...c, order: c.order - 1 };
  });
  cards = cards.filter((card) => {
    return card.id !== id;
  });
  return cards;
}

/**
 * Creates new empty column. Returns changed array
 */
export function addColumn(
  columns: Array<ColData>,
  column: ColData,
  options?: { place?: "start" | "end" },
): Array<ColData> {
  if (!options) {
    return [...columns, { ...column, order: columns.length + 1 }];
  } else {
    if (options.place === "start") {
      return [column, ...columns];
    } else if (options.place === "end") {
      return [...columns, { ...column, order: columns.length + 1 }];
    } else {
      return [...columns];
    }
  }
}

export function moveCard(
  cards: CardData[],
  id: string,
  amount: number,
): { cards: CardData[]; changed?: CardData[] } {
  const cardIdx = cards.findIndex((card) => card.id === id);
  if (cardIdx === -1) throw new Error("Moving card was not found");
  const newCards = [...cards];

  const card = { ...newCards[cardIdx] };

  const newOrder = Math.max(1, Math.min(card.order + amount, newCards.length));
  if (newOrder === card.order) return { cards };
  const replacedCardIdx = newCards.findIndex((c) => {
    return c.order == newOrder;
  });
  if (replacedCardIdx !== -1) {
    newCards.splice(replacedCardIdx, 1, {
      ...newCards[replacedCardIdx],
      order: card.order,
    });
  }
  newCards.splice(cardIdx, 1, { ...card, order: newOrder });
  return {
    cards: newCards,
    changed: [newCards[cardIdx], newCards[replacedCardIdx]].filter(Boolean),
  };
}

export function moveColumn(
  columns: Array<ColData>,
  colId: string,
  amount: number,
): Array<ColData> {
  const colIdx = columns.findIndex((col) => col.id === colId);
  if (colIdx === -1) throw new Error("No column found, can't move nothing");
  const col1 = columns[colIdx];
  const newOrder = Math.max(1, Math.min(col1.order + amount, columns.length));
  console.log(col1.order, newOrder);
  if (newOrder === col1.order) return columns;
  const col2Idx = columns.findIndex((col) => col1.order + amount === col.order);
  const newCols = [...columns];
  if (col2Idx !== -1) {
    newCols.splice(col2Idx, 1, {
      ...columns[col2Idx],
      order: col1.order,
    });
  }
  newCols.splice(colIdx, 1, {
    ...col1,
    order: col1.order + amount,
  });

  return newCols;
}
export function swapColumns(
  columns: Array<ColData>,
  colId: string,
  col2Id: string,
): Array<ColData> {
  const colIdx = columns.findIndex((col) => col.id === colId);
  const col2Idx = columns.findIndex((col) => col.id === col2Id);
  const newCols = [...columns];
  newCols.splice(colIdx, 1, {
    ...columns[col2Idx],
    order: columns[colIdx].order,
  });
  newCols.splice(col2Idx, 1, {
    ...columns[colIdx],
    order: columns[col2Idx].order,
  });
  return newCols;
}
/**
 * Gets an array of columns and removes column with provided id
 * @throws If column was not found
 * @returns {Array<ColData>} - changed array
 */
export function removeColumn(
  colId: string,
  columns: Array<ColData>,
): Array<ColData> {
  const colIdx = columns.findIndex((col) => {
    return col.id === colId;
  });
  if (colIdx === -1) throw new Error("No column was found");
  let newColumns = [...columns];
  newColumns = newColumns.map((col) => {
    if (col.order < columns[colIdx].order) return col;
    return { ...col, order: col.order - 1 };
  });
  newColumns.splice(colIdx, 1);
  return newColumns;
}

/**
 * Gets an array of columns and replaces header in it
 * @throws If column was not found
 * @returns {Array<ColData>} - changed array
 */
export function renameColumn(
  colId: string,
  header: string,
  columns: Array<ColData>,
): Array<ColData> {
  const colIdx = columns.findIndex((col) => {
    return col.id === colId;
  });
  if (colIdx === -1) throw new Error("No column was found");
  const newColumns = [...columns];
  const newColumn = { ...columns[colIdx], header: header };
  newColumns.splice(colIdx, 1, newColumn);
  return newColumns;
}
/**
 * Gets an array of columns and replaces column with provided id
 * @throws If column was not found
 * @returns {Array<ColData>} - changed array
 */
export function replaceColumn(
  colId: string,
  colData: ColData,
  columns: Array<ColData>,
): Array<ColData> {
  const colIdx = columns.findIndex((col) => {
    return col.id === colId;
  });
  if (colIdx === -1) throw new Error("No column was found");
  const newColumns = [...columns];
  newColumns.splice(colIdx, 1, { ...colData, id: columns[colIdx].id });
  return newColumns;
}
/**
 * Gets an id of tag and returns copy of card without it
 * @throws If column was not found
 * @returns  changed card
 */
export function removeTag(
  store: EnhancedStore,
  dispatch: AppDispatch,
  cardId: string,
  tagId: string,
) {
  const { card } = getCard(store.getState().kanban, cardId);
  dispatch(
    setCardTagsAction({
      cardId: cardId,
      tags: card.tagIds.filter((t) => t != tagId),
    }),
  );
}
