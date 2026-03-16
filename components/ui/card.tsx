import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-[#dfd8cf] bg-[#f6f1eb] p-7 shadow-[0_1px_2px_rgba(46,37,29,0.05)] ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
