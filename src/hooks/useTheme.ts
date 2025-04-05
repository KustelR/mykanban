export function useTheme(): () => "light" | "dark" | undefined {
  return () => {
    try {
      let theme = localStorage.getItem("theme");

      if (theme !== "dark" && theme !== "light") return undefined;
      else return theme;
    } catch {
      return undefined;
    }
  };
}
