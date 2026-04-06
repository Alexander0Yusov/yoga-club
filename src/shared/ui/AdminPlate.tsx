"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type AdminPlateProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
  }
>;

export default function AdminPlate({
  children,
  className = "",
  type = "button",
  ...props
}: AdminPlateProps) {
  return (
    <button
      type={type}
      {...props}
      className={[
        "inline-flex items-center gap-2 border-2 border-localbrown bg-white/95 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-localbrown shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md transition hover:bg-white hover:shadow-lg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
