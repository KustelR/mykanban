declare global {
  type validator = (input: string) => [boolean, string];
  interface CardData {
    name: string;
    description: string;
    tags: Array<TagData>;
    id: string;
    colId: string;
  }
  interface ColData {
    name: string;
    id: string;
    cards: Array<CardData>;
  }
  interface Identified {
    id: string;
  }
  type KanbanState = {
    columns: Array<ColData & Identified>;
    name: string;
  };
  type TagData = {
    name: string;
    color: string;
    id: string;
    cardId: string;
  };
}
export {};
