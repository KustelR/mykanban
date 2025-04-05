"use client";

import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useState } from "react";
import Computer from "@public/computer.svg";
import Sun from "@public/sun.svg";
import Moon from "@public/moon.svg";

export default function ThemeChanger() {
  const [themeIcon, setThemeIcon] = useState<undefined | "dark" | "light">(
    undefined,
  );
  const theme = useTheme();
  useEffect(() => {
    const t = theme.get();
    setThemeIcon(t);
  }, []);
  return (
    <button
      onClick={() => {
        switch (theme.get()) {
          case undefined:
            setThemeIcon("dark");
            localStorage.setItem("theme", "dark");
            document.documentElement.classList.add("dark");
            break;
          case "light":
            setThemeIcon("dark");
            localStorage.setItem("theme", "dark");
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
            break;
          case "dark":
            setThemeIcon("light");
            localStorage.setItem("theme", "light");
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
            break;
        }
      }}
    >
      {!themeIcon && (
        <Computer
          width={32}
          height={32}
          className="*:stroke-transparent *:fill-black dark:*:fill-neutral-600"
        />
      )}
      {themeIcon === "light" && (
        <Moon width={32} height={32} className="*:stroke-black *:fill-black" />
      )}
      {themeIcon === "dark" && (
        <Sun
          width={32}
          height={32}
          className="*:stroke-white *:fill-transparent"
        />
      )}
    </button>
  );
}
