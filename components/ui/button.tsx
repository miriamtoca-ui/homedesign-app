import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8673b]/50 disabled:cursor-not-allowed disabled:opacity-60";

  const styles =
    variant === "primary"
      ? "bg-[#c8673b] text-white hover:bg-[#b65b33]"
      : "bg-transparent text-[#564e45] hover:bg-[#ece6df]";

  return (
    <button className={`${base} ${styles} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
