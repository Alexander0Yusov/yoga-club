"use client";

import React, { ChangeEventHandler, useEffect, useMemo, useRef, useState } from "react";

import { format, isValid } from "date-fns";
import { uk } from "date-fns/locale";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";
import "react-day-picker/dist/style.css";

import IconCalendar from "@/shared/ui/IconCalendar";

type DateTimePickerProps = {
  fieldName: "timeTarget" | "endTimeTarget";
  label: string;
  register: any;
  setValue: any;
  errors: any;
  defaultValue?: string;
};

function toLocalIso(datePart: string, timePart: string) {
  if (!datePart || !timePart) {
    return "";
  }

  const combined = new Date(`${datePart}T${timePart}`);

  if (Number.isNaN(combined.getTime())) {
    return "";
  }

  return combined.toISOString();
}

function parseInitialValue(value?: string) {
  if (!value) {
    const now = new Date();
    return {
      date: now,
      datePart: format(now, "yyyy-MM-dd"),
      timePart: "12:00",
    };
  }

  const parsed = new Date(value);

  if (!isValid(parsed)) {
    const now = new Date();
    return {
      date: now,
      datePart: format(now, "yyyy-MM-dd"),
      timePart: "12:00",
    };
  }

  return {
    date: parsed,
    datePart: format(parsed, "yyyy-MM-dd"),
    timePart: format(parsed, "HH:mm"),
  };
}

export default function DateTimePicker({
  fieldName,
  label,
  register,
  setValue,
  errors,
  defaultValue,
}: DateTimePickerProps) {
  const initial = useMemo(() => parseInitialValue(defaultValue), [defaultValue]);
  const [selected, setSelected] = useState<Date>(initial.date);
  const [datePart, setDatePart] = useState(initial.datePart);
  const [timePart, setTimePart] = useState(initial.timePart);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const nextValue = toLocalIso(datePart, timePart);
    setValue(fieldName, nextValue, { shouldValidate: true });
  }, [datePart, timePart, fieldName, setValue]);

  useEffect(() => {
    const next = parseInitialValue(defaultValue);
    setSelected(next.date);
    setDatePart(next.datePart);
    setTimePart(next.timePart);
  }, [defaultValue]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const nextDate = new Date(`${e.currentTarget.value}T12:00:00`);

    if (isValid(nextDate)) {
      setSelected(nextDate);
      setDatePart(format(nextDate, "yyyy-MM-dd"));
      setIsOpen(false);
    }
  };

  const handleDaySelect: SelectSingleEventHandler = (date) => {
    if (date) {
      setSelected(date);
      setDatePart(format(date, "yyyy-MM-dd"));
      setIsOpen(false);
    }
  };

  const displayDate = format(selected, "dd.MM.yyyy");

  return (
    <div ref={rootRef} className="relative z-20">
      <input type="hidden" {...register(fieldName)} />

      <label className="mb-2 block text-localbrown">{label}</label>

      <div
        className={`grid grid-cols-[1fr_112px_48px] overflow-hidden border bg-white ${
          errors ? "border-red-600" : "border-localbrown"
        }`}
      >
        <input
          value={datePart}
          onChange={handleInputChange}
          size={12}
          type="text"
          placeholder={format(new Date(), "yyyy-MM-dd")}
          className="h-[40px] border-0 px-[16px] text-localbrown outline-none"
        />

        <input
          type="time"
          value={timePart}
          onChange={(event) => setTimePart(event.target.value)}
          className="h-[40px] border-x border-localbrown px-3 text-localbrown outline-none"
        />

        <button
          type="button"
          aria-label="Pick a date"
          onClick={() => setIsOpen((value) => !value)}
          className="flex h-[40px] items-center justify-center"
        >
          <IconCalendar />
        </button>
      </div>

      <p className="mt-2 text-xs text-cadetblue">
        {displayDate} • {timePart}
      </p>

      {isOpen && (
        <div className="absolute left-0 top-[64px] z-50 border border-localbrown bg-white p-2 shadow-lg">
          <DayPicker
            mode="single"
            defaultMonth={selected}
            selected={selected}
            onSelect={handleDaySelect}
            locale={uk}
          />
        </div>
      )}
    </div>
  );
}
