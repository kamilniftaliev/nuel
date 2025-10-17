import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "primary";
}

export function Button({
  children,
  className,
  variant = "outline",
  ...props
}: Props) {
  return (
    <button
      {...props}
      type="button"
      className={cn(
        "flex items-center gap-2 p-2 rounded-md cursor-pointer",
        {
          "border border-gray-300 dark:bg-container dark:border-gray-600":
            variant === "outline",
          "bg-primary text-white font-semibold": variant === "primary",
        },
        className,
      )}
    >
      {children}
    </button>
  );
}
