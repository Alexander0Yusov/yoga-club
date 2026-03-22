"use client";

import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";

import { format, isValid, parse } from "date-fns";
import { uk } from "date-fns/locale";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";
import "react-day-picker/dist/style.css";

import IconCalendar from "@/components/0_ui/IconCalendar";

export default function DateTimePicker({
  register,
  setValue,
  errors,
}: {
  register: any;
  setValue: any;
  errors: any;
}) {
  const [selected, setSelected] = useState<Date>();
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

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const date = parse(e.currentTarget.value, "y-MM-dd", new Date());

    if (isValid(date)) {
      setSelected(date);
      setValue("timeTarget", format(date, "y-MM-dd"), {
        shouldValidate: true,
      });
    } else {
      setSelected(undefined);
      setValue("timeTarget", "", {
        shouldValidate: true,
      });
    }
  };

  const handleDaySelect: SelectSingleEventHandler = (date) => {
    setSelected(date);

    if (date) {
      setValue("timeTarget", format(date, "y-MM-dd"), {
        shouldValidate: true,
      });
      setIsOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative z-20 border-[1px] border-orange-950">
      <div className="relative">
        <input
          {...register("timeTarget")}
          onChange={handleInputChange}
          size={12}
          type="text"
          placeholder={format(new Date(), "y-MM-dd")}
          className={
            "h-[40px] w-[230px] rounded-[10px] border-[1px] px-[16px] text-localbrown " +
            `${errors ? "border-red-600" : "border-localbrown"}`
          }
        />

        <button
          type="button"
          aria-label="Pick a date"
          onClick={() => setIsOpen((value) => !value)}
          className="absolute left-[192px] top-0 flex h-full w-[30px] items-center justify-center border-[1px] border-localbrown"
        >
          <IconCalendar />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-[48px] z-50 rounded-[10px] border-[1px] border-localbrown bg-white p-2 shadow-lg">
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
