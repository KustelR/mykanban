import { nanoid } from "@reduxjs/toolkit";

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
  const newColumnCards = [...newColumns[changingColumnIdx].cards];
  const newCard = { ...card, ...{ colId: colId } };
  newColumnCards.push(newCard);
  newColumns[changingColumnIdx] = {
    ...newColumns[changingColumnIdx],
    ...{ cards: newColumnCards },
  };
  return newColumns;
}

/**
 * Gets an array of columns and removes card with provided id in column with specified id
 * @throws If column or card was not found
 * @returns {Array<ColData>} - changed array
 */
export function removeCard(
  cardId: string,
  colId: string,
  columns: Array<ColData>,
): Array<ColData> {
  const newColumns = [...columns];
  const colIdx = columns.findIndex((col) => {
    return col.id === colId;
  });
  if (colIdx === -1) throw new Error("No column was found");
  const card: CardData | undefined = columns[colIdx].cards.find((card) => {
    return card.id === cardId;
  });
  if (!card) throw new Error("No card was found");
  let cards = [...columns[colIdx].cards];
  cards = cards.map((c) => {
    if (c.order < card.order) return c;
    return { ...c, order: c.order - 1 };
  });
  cards = cards.filter((card) => {
    return card.id !== cardId;
  });
  newColumns[colIdx] = { ...columns[colIdx], cards: cards };
  return newColumns;
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
    return [...columns, column];
  } else {
    if (options.place === "start") {
      return [column, ...columns];
    } else if (options.place === "end") {
      return [...columns, column];
    } else {
      return [...columns];
    }
  }
}

export function moveCard(
  columns: Array<ColData>,
  colId: string,
  cardId: string,
  amount: number,
): Array<ColData> {
  const colIdx = columns.findIndex((col) => col.id === colId);
  if (colIdx === -1) throw new Error("Column with moving card was not found");
  const cardIdx = columns[colIdx].cards.findIndex((card) => card.id === cardId);
  if (cardIdx === -1) throw new Error("Moving card was not found");
  const newCards = [...columns[colIdx].cards];

  const card = { ...newCards[cardIdx] };

  const newOrder = Math.max(0, Math.min(card.order - amount, newCards.length));
  if (newOrder === card.order) return columns;
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
  const newCol = { ...columns[colIdx], cards: newCards };

  const newCols = [...columns];
  newCols.splice(colIdx, 1, newCol);
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
  kanban: KanbanState,
  cardData: CardData,
  tagId: string,
): CardData {
  kanban.tags = kanban.tags.filter((tag) => {
    tag.id !== tagId;
  });
  return {
    ...cardData,
    tagIds: cardData.tagIds.filter((tag) => tag !== tagId),
  };
}
