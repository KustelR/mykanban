declare global {
  type validator = (input: string) => [boolean, string];
  interface CardData {
    title: string;
    description: string;
    tags: Array<TagData>;
    id: string;
    colId: string;
  }
  interface ColData {
    header: string;
    id: string;
    cards: Array<CardData>;
  }
  interface Identified {
    id: string;
  }
  type KanbanState = {
    columns: Array<ColData & Identified>;
    label: string;
  };
  type TagData = {
    label: string;
    color: { r: number; g: number; b: number };
    id: string;
    cardId: string;
    colId: string;
  };
}
export {};
