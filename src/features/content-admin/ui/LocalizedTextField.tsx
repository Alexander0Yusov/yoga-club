"use client";

import {
  type FieldValues,
  type Path,
  useFormContext,
  useWatch,
} from "react-hook-form";

import type { ContentAdminLocale } from "@/features/content-admin/model/localizedTextForm";

type Props<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  activeLocale: ContentAdminLocale;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  className?: string;
  disabled?: boolean;
};

export default function LocalizedTextField<TFieldValues extends FieldValues>({
  name,
  activeLocale,
  label,
  placeholder,
  multiline = false,
  rows = 4,
  required = false,
  className = "",
  disabled = false,
}: Props<TFieldValues>) {
  const { control, setValue } = useFormContext<TFieldValues>();
  const localeFieldName = `${name}.${activeLocale}` as Path<TFieldValues>;
  const watchedValue = useWatch({ control, name: localeFieldName }) as unknown;
  const currentValue = typeof watchedValue === "string" ? watchedValue : "";

  const updateLocalizedValue = (nextValue: string) => {
    setValue(localeFieldName as Path<TFieldValues>, nextValue as any, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <label key={localeFieldName} className={`block ${className}`.trim()}>
      <span className="mb-2 block text-sm font-medium text-localbrown">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      <div className="relative">
        {multiline ? (
          <textarea
            value={currentValue}
            onChange={(event) => updateLocalizedValue(event.target.value)}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full rounded-none border border-localbrown bg-white px-4 py-3 pr-14 outline-none transition placeholder:text-localbrown/35 focus:border-localbrown focus:ring-0"
          />
        ) : (
          <input
            value={currentValue}
            onChange={(event) => updateLocalizedValue(event.target.value)}
            type="text"
            placeholder={placeholder}
            disabled={disabled}
            className="h-[44px] w-full rounded-none border border-localbrown bg-white px-4 py-3 pr-14 outline-none transition placeholder:text-localbrown/35 focus:border-localbrown focus:ring-0"
          />
        )}
        <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-localbrown/25 bg-brown-light-light px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-localbrown">
          {activeLocale.toUpperCase()}
        </span>
      </div>
    </label>
  );
}
