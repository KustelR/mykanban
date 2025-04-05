type ColorTheme = undefined | "dark" | "light";

class Themes {
  static theme: ColorTheme;
  static subscribers: Array<(theme: ColorTheme) => void> = [];
  constructor() {
    const filteredTheme = filterTheme(localStorage.getItem("theme"));
    this.setTheme(filteredTheme);
  }
  getTheme() {
    const theme = localStorage.getItem("theme");
    const filteredTheme = filterTheme(theme);
    return filteredTheme;
  }
  setTheme(theme: ColorTheme) {
    Themes.theme = theme;
    try {
      if (theme) localStorage.setItem("theme", theme);
    } catch (err) {}
    Themes.subscribers.forEach((s) => s(theme));
  }
  subscribe(callback: (theme: ColorTheme) => void) {
    Themes.subscribers.push(callback);
  }
}

export function useTheme(): {
  get: () => ColorTheme;
  set: (theme: ColorTheme) => void;
  subscribe: (callback: (theme: ColorTheme) => void) => void;
} {
  const t = new Themes();
  return { get: t.getTheme, set: t.setTheme, subscribe: t.subscribe };
}

function filterTheme(data: any): ColorTheme {
  const theme = localStorage.getItem("theme");
  let filteredTheme: undefined | "dark" | "light";
  if (theme !== "dark" && theme != "light") filteredTheme = undefined;
  else filteredTheme = theme;

  return filteredTheme;
}
