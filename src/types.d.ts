declare global {
  type validator = (input: string) => [boolean, string];
  interface CardData {
    title: string;
    description: string;
    tags: Array<string>;
    column?: ColData;
    id: string;
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
}
export {};
