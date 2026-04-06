"use client";

import type { ReactNode } from "react";

type AdminCircleButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
};

export default function AdminCircleButton({
  label,
  onClick,
  disabled = false,
  children,
}: AdminCircleButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-[93px] w-[93px] items-center justify-center rounded-full border border-white/55 bg-white/45 text-localbrown opacity-[0.72] shadow-none backdrop-blur-sm transition hover:bg-white/60 hover:opacity-100 hover:text-localbrown disabled:cursor-not-allowed disabled:border-white/45 disabled:bg-white/32 disabled:text-localbrown/55 disabled:opacity-[0.38]"
    >
      {children}
    </button>
  );
}
