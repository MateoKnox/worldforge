"use client";
import { clsx } from "clsx";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-[#d4a017] text-black font-semibold hover:bg-[#f0c040] glow-gold transition-all duration-200",
  secondary: "bg-[#7c3aed] text-white font-semibold hover:bg-[#6d28d9] glow-purple transition-all duration-200",
  ghost: "border border-[rgba(212,160,23,0.4)] text-[#d4a017] hover:bg-[rgba(212,160,23,0.1)] transition-all duration-200",
  danger: "bg-[#dc2626] text-white font-semibold hover:bg-[#b91c1c] transition-all duration-200",
};

export function Button({ children, variant = "primary", onClick, href, className, disabled }: ButtonProps) {
  const base = "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display text-sm tracking-wide cursor-pointer select-none";
  const cls = clsx(base, variants[variant], disabled && "opacity-50 cursor-not-allowed", className);

  if (href) {
    return <a href={href} className={cls}>{children}</a>;
  }

  return (
    <button onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
