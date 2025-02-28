declare global {
  type validator = (input: string) => [boolean, string];
  interface CardData {
    name: string;
    description: string;
    tagIds: Array<string> | null;
    id: string;
    order: number;
    columnId: string;
  }
  interface ColData {
    name: string;
    id: string;
    order: number;
    cards: Array<CardData> | null;
  }
  interface Identified {
    id: string;
  }
  type KanbanState = {
    columns: Array<ColData & Identified>;
    name: string;
    tags: Array<TagData> | null;
  };
  type TagData = {
    name: string;
    color: string;
    id: string;
    cardId: string;
  };
}
export {};
