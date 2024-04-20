"use client";

import React, { ChangeEventHandler, useRef, useState, useEffect } from "react";

import FocusTrap from "focus-trap-react";
import { usePopper } from "react-popper";

import { format, isValid, parse } from "date-fns";
import { uk, enUS, de } from "date-fns/locale";

import { DayPicker, SelectSingleEventHandler } from "react-day-picker";
import "react-day-picker/dist/style.css";
import IconCalendar from "../0_ui/IconCalendar";

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
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const popperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const popper = usePopper(popperRef.current, popperElement, {
    placement: "bottom-start",
  });

  useEffect(() => {
    const handlerClickOnNotTarget: any = (e: Event) => {
      const elementsInPropagationPath = e?.composedPath && e.composedPath();

      if (
        !elementsInPropagationPath?.find((el: any) =>
          el?.classList?.contains("dialog-sheet")
        )
      ) {
        setIsPopperOpen(false);
      }
    };

    const handlerKeydown = (e: any) => {
      if (e.code === "Escape") {
        setIsPopperOpen(false);
      }
    };

    if (isPopperOpen) {
      document.body.addEventListener("click", handlerClickOnNotTarget);
      window.addEventListener("keydown", handlerKeydown);
    } else {
      document.body.removeEventListener("click", handlerClickOnNotTarget);
      window.removeEventListener("keydown", handlerKeydown);
    }
  }, [isPopperOpen, setIsPopperOpen]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const date = parse(e.currentTarget.value, "y-MM-dd", new Date());

    if (isValid(date)) {
      setSelected(date);
    } else {
      setSelected(undefined);
    }

    return e.currentTarget.value;
  };

  const handleDaySelect: SelectSingleEventHandler = (date) => {
    setSelected(date);

    if (date) {
      setValue("timeTarget", format(date, "y-MM-dd"), {
        shouldValidate: true,
      });
      closePopper();
    } else {
      setValue("timeTarget", "", {
        shouldValidate: true,
      });
    }
  };

  function closePopper() {
    setIsPopperOpen(false);
    buttonRef?.current?.focus();
  }

  function handleCalendarClick() {
    setIsPopperOpen(true);
  }

  return (
    <div className="myRdp border-[1px] border-orange-950">
      <div ref={popperRef} className=" relative">
        <input
          {...register("timeTarget")}
          onChange={(e) =>
            setValue("timeTarget", handleInputChange(e), {
              shouldValidate: true,
            })
          }
          size={12}
          type="text"
          placeholder={format(new Date(), "y-MM-dd")}
          className={
            " w-[230px] h-[40px] px-[16px] border-[1px] border-localbrown rounded-[10px] " +
            `${errors ? "border-red-600" : "border-localbrown"}`
          }
        />

        <button
          ref={buttonRef}
          type="button"
          aria-label="Pick a date"
          onClick={handleCalendarClick}
          className="absolute flex items-center justify-center w-[30px] h-full left-[192px] top-0 border-[1px] border-localbrown"
        >
          <IconCalendar />
        </button>
      </div>

      {isPopperOpen && (
        <FocusTrap
          active
          focusTrapOptions={{
            initialFocus: false,
            allowOutsideClick: true,
            clickOutsideDeactivates: true,
            // onDeactivate: closePopper,
            // эффект достигнут в useEffect - костыль
            fallbackFocus: buttonRef.current || undefined,
          }}
        >
          <div
            tabIndex={-1}
            style={popper.styles.popper}
            className="dialog-sheet bg-white border-[1px] border-localbrown"
            {...popper.attributes.popper}
            ref={setPopperElement}
            role="dialog"
            aria-label="DayPicker calendar"
          >
            <DayPicker
              initialFocus={isPopperOpen}
              mode="single"
              defaultMonth={selected}
              selected={selected}
              onSelect={handleDaySelect}
              // fromYear={2015}
              // toYear={2025}
              // captionLayout="dropdown-buttons"
              // showOutsideDays
              // fixedWeeks
              locale={uk}
            />
          </div>
        </FocusTrap>
      )}
    </div>
  );
}
