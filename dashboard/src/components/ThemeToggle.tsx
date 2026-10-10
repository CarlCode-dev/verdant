"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("verdant-theme", next);
    } catch {
      /* storage unavailable, the choice just won't persist */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/10 bg-cream/5 text-mint hover:text-cream"
    >
      <Sun size={15} className="hidden dark:block" />
      <Moon size={15} className="dark:hidden" />
    </button>
  );
}