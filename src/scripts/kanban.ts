import { nanoid } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Gets an array of columns and pushes card to column with specified id
 * @throws If column was not found
 */
export function pushCard(
  card: CardData,
  colId: string,
  columns: Array<ColData>,
) {
  const host = process.env.NEXT_PUBLIC_PROJECT_HOST;
  if (!host) {
    console.log("post failed");
    return;
  }
  axios.post(`${host}/${colId}`, { type: "post_card", card: card });
}

export function updateCard(id: string, card: CardData) {
  const host = process.env.NEXT_PUBLIC_PROJECT_HOST;
  if (!host) {
    console.log("post failed");
    return;
  }
  axios.put(`${host}/${id}`, { type: "update_card", card: card });
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
export async function addColumn(
  projectId: string,
  column: ColData,
  options?: { place?: "start" | "end" },
) {
  const host = process.env.NEXT_PUBLIC_PROJECT_HOST;
  if (!host) {
    console.log("post failed");
    return;
  }

  await axios.post(`${host}/${projectId}`, {
    type: "post_column",
    column: column,
  });
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
  const newColumns = [...columns];
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
 * Gets an array of columns and removes column with provided id
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
export function removeTag(cardData: CardData, tagId: string): CardData {
  return {
    ...cardData,
    tagIds: cardData.tagIds.filter((tag) => tag !== tagId),
  };
}

/**
 * Gets an id of tag and returns copy of card without it
 * @throws If column was not found
 * @returns  changed card
 */
export function swapTags(
  cardData: CardData,
  tagId: string,
  tag2Id: string,
): CardData {
  const newTags = [...cardData.tagIds];
  const tagIdx = cardData.tagIds.findIndex((tag) => tag === tagId);
  const tag2Idx = cardData.tagIds.findIndex((tag) => tag2Id === tag);
  newTags.splice(tagIdx, 1, cardData.tagIds[tag2Idx]);
  newTags.splice(tag2Idx, 1, cardData.tagIds[tagIdx]);
  return { ...cardData, tagIds: newTags };
}
