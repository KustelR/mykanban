declare global {
  type validator = (input: string) => [boolean, string];
  type CardData = {
    title: string;
    description: string;
    tags: Array<string>;
  };
  type ColData = {
    header: string;
    cards: Array<CardData>;
  };
}
export {};
