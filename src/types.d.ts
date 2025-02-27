declare global {
  type validator = (input: string) => [boolean, string];
  interface CardData {
    name: string;
    description: string;
    tagIds: Array<string>;
    id: string;
    order: number;
    colId: string;
  }
  interface ColData {
    name: string;
    id: string;
    order: number;
    cards: Array<CardData>;
  }
  interface Identified {
    id: string;
  }
  type KanbanState = {
    columns: Array<ColData & Identified>;
    name: string;
    tags: Array<TagData>;
  };
  type TagData = {
    name: string;
    color: string;
    id: string;
    cardId: string;
  };
}
export {};
