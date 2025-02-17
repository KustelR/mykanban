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
  const newColumns = [...columns];
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
