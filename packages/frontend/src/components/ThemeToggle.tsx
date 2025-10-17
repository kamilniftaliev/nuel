import type { ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { FiSun } from "react-icons/fi";
import { HiComputerDesktop } from "react-icons/hi2";
import { MdNightlight } from "react-icons/md";
import { cn } from "@/utils/common";
import { Button } from "./Button";

interface Props {
  className?: ClassValue;
}

export function ThemeToggle({ className }: Props) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const toggle = () => {
    const newTheme =
      theme === "dark" ? "light" : theme === "light" ? "system" : "dark";

    setTheme(newTheme);
  };

  useEffect(() => {
    if (localStorage.theme) {
      setTheme(localStorage.theme);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.remove("dark");
      delete localStorage.theme;

      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      window.matchMedia("(prefers-color-scheme: dark)").onchange = (
        e: MediaQueryListEvent,
      ) => {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      };

      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return () => {
        window.matchMedia("(prefers-color-scheme: dark)").onchange = null;
      };
    }
  }, [theme]);

  const iconClasses =
    "absolute left-1.5 top-1.5 opacity-0 transition-opacity duration-500 text-black dark:text-white";

  return (
    <Button onClick={toggle} className={cn("relative w-7.5 h-7.5", className)}>
      <FiSun
        className={cn(iconClasses, {
          "opacity-100": theme === "light",
        })}
      />
      <MdNightlight
        className={cn(iconClasses, {
          "opacity-100": theme === "dark",
        })}
      />
      <HiComputerDesktop
        className={cn(iconClasses, {
          "opacity-100": theme === "system",
        })}
      />
    </Button>
  );
}
