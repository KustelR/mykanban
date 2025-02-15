declare global {
  type validator = (input: string) => [boolean, string];
  interface CardData {
    title: string;
    description: string;
    tags: Array<string>;
    colId?: string;
  }
  interface ColData {
    header: string;
    cards: Array<CardData>;
  }
  interface Identified {
    id: string;
  }
  type KanbanState = {
    columns: Array<ColData & Identified>;
    label: string;
  };
}
export {};
