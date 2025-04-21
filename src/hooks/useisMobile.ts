export default function useIsMobile(): boolean {
  return window.matchMedia("(hover: none)").matches;
}
