declare global {
  type validator = (input: string) => [boolean, string];
  interface CardData {
    name: string;
    description: string;
    tagIds: Array<string>;
    id: string;
    colId: string;
  }
  interface CardDataFromBackend {
    name: string;
    description: string;
    tagIds: Array<string> | undefined;
    id: string;
    colId: string;
  }
  interface ColData {
    name: string;
    order: number;
    id: string;
    cards: Array<CardData>;
  }
  interface ColDataFromBackend {
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
