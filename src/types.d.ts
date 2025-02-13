declare global {
  type validator = (input: string) => [boolean, string];
}
export {};
