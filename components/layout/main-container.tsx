import { cn } from "@/lib/utils";
import type React from "react";

interface MainContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A reusable container component for main page content,
 * applying consistent padding, max-width, and entry animation.
 */
export function MainContainer({ children, className }: MainContainerProps) {
  return (
    <main
      className={cn(
        "container mx-auto px-4 py-6 max-w-7xl animate-in fade-in",
        className,
      )}
    >
      {children}
    </main>
  );
}
