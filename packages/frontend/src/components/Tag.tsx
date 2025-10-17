"use client";

import type { ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { cn, getRandomColor } from "@/utils";

// For the sake of simplicity, I'll store colors in a simple object.
const colorsStore: Record<string, string> = {};

interface Props {
  children: string;
  className?: ClassValue;
  useRandomColor?: boolean;
}

export function Tag({ children, useRandomColor = false, className }: Props) {
  const [color, setColor] = useState("");

  // To avoid hydration error, I set the color on mount
  useEffect(() => {
    if (useRandomColor) {
      const color = colorsStore[children] || getRandomColor();
      colorsStore[children] = color;
      setColor(color);
    }
  }, [children, useRandomColor]);

  return (
    <span
      className={cn("rounded-sm py-1 px-2 text-white font-semibold", className)}
      style={{
        backgroundColor: color,
      }}
    >
      {children}
    </span>
  );
}
