"use client";

import type { ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl rounded-xl bg-[#f7f4f0] p-8 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">{title}</h2>
          <button
            aria-label="Cerrar"
            className="text-3xl leading-none text-[#7d7368] hover:text-[#2c241d]"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
