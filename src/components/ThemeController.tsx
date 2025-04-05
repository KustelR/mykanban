"use client";

import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useState } from "react";

export default function ThemeController() {
  let theme = useTheme();

  useEffect(() => {
    let resTheme: "dark" | "light" = "light";
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      resTheme = "dark";
    } else {
      resTheme = "light";
    }
    if (theme.get() === "dark") resTheme = "dark";
    if (theme.get() === "light") resTheme = "light";

    document.documentElement.classList.add(resTheme);
  }, []);
  return <></>;
}
