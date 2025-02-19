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
  const cards = columns[colIdx].cards.filter((card) => {
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

  const newIdx = Math.max(0, Math.min(cardIdx - amount, newCards.length - 1));
  if (newIdx === cardIdx) return columns;
  newCards.splice(newIdx, 1, columns[colIdx].cards[cardIdx]);
  newCards.splice(cardIdx, 1, columns[colIdx].cards[newIdx]);
  const newCol = { ...columns[colIdx], cards: newCards };

  const newCols = [...columns];
  newCols.splice(colIdx, 1, newCol);
  return newCols;
}
export function swapCards(
  columns: Array<ColData>,
  colId: string,
  cardId: string,
  card2Id: string,
): Array<ColData> {
  const colIdx = columns.findIndex((col) => col.id === colId);
  if (colIdx === -1) throw new Error("Column with moving card was not found");
  const cardIdx = columns[colIdx].cards.findIndex((card) => card.id === cardId);
  const card2Idx = columns[colIdx].cards.findIndex(
    (card) => card.id === card2Id,
  );
  if (cardIdx === -1 || card2Idx === -1)
    throw new Error("Moving card was not found");
  const newCards = [...columns[colIdx].cards];

  newCards.splice(cardIdx, 1, columns[colIdx].cards[card2Idx]);
  newCards.splice(card2Idx, 1, columns[colIdx].cards[cardIdx]);
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
  newCols.splice(colIdx, 1, columns[col2Idx]);
  newCols.splice(col2Idx, 1, columns[colIdx]);
  return newCols;
}
/**
 * Gets an array of columns and removes card with provided id in column with specified id
 * @throws If column or card was not found
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
  const newColumns = [...columns];
  newColumns.splice(colIdx, 1);
  return newColumns;
}
