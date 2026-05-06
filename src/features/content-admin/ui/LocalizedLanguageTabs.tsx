"use client";

import type { ContentAdminLocale } from "@/features/content-admin/model/localizedTextForm";

type Props = {
  activeLocale: ContentAdminLocale;
  onChange: (locale: ContentAdminLocale) => void;
  className?: string;
  disabled?: boolean;
};

const tabs: Array<{ locale: ContentAdminLocale; label: string }> = [
  { locale: "ru", label: "RU" },
  { locale: "en", label: "EN" },
  { locale: "de", label: "DE" },
  { locale: "uk", label: "UK" },
];

export default function LocalizedLanguageTabs({
  activeLocale,
  onChange,
  className = "",
  disabled = false,
}: Props) {
  return (
    <div
      role="tablist"
      aria-label="Выбор языка формы"
      className={`flex flex-wrap gap-2 ${className}`.trim()}
    >
      {tabs.map((tab) => {
        const isActive = tab.locale === activeLocale;

        return (
          <button
            key={tab.locale}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => onChange(tab.locale)}
            className={[
              "h-10 rounded-full border px-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition",
              disabled ? "cursor-not-allowed opacity-60" : "",
              isActive
                ? "border-localbrown bg-localbrown text-white"
                : "border-localbrown/30 bg-white text-localbrown hover:border-localbrown/60",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
