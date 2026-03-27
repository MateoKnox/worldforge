import { clsx } from "clsx";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: "gold" | "purple" | "none";
}

export function Card({ children, className, glow = "none" }: CardProps) {
  return (
    <div className={clsx(
      "glass rounded-xl p-6",
      glow === "gold" && "glow-gold",
      glow === "purple" && "glow-purple",
      className
    )}>
      {children}
    </div>
  );
}
