"use client";
import { format, isValid, parse } from "date-fns";
import { uk, enUS, de } from "date-fns/locale";
import FocusTrap from "focus-trap-react";
import { usePopper } from "react-popper";
import React, { ChangeEventHandler, useRef, useState, useEffect } from "react";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";

import "react-day-picker/dist/style.css";

export default function DateTimePicker({
  timeTarget,
  setTimeTarget,
}: {
  timeTarget: string;
  setTimeTarget: any;
}) {
  const [selected, setSelected] = useState<Date>();
  const [inputValue, setInputValue] = useState<string>(timeTarget || "");
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

  const closePopper = () => {
    setIsPopperOpen(false);
    buttonRef?.current?.focus();
  };

  const handleButtonClick = () => {
    setIsPopperOpen(true);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.currentTarget.value);

    const date = parse(e.currentTarget.value, "y-MM-dd", new Date());
    if (isValid(date)) {
      setSelected(date);
      setTimeTarget(date.toString());
    } else {
      setSelected(undefined);
      setTimeTarget("");
    }
  };

  const handleDaySelect: SelectSingleEventHandler = (date) => {
    setSelected(date);
    setTimeTarget(date?.toString() || "");

    if (date) {
      setInputValue(format(date, "y-MM-dd"));
      closePopper();
    } else {
      setInputValue("");
    }
  };

  return (
    <div className="border-[1px] border-orange-950">
      <div ref={popperRef}>
        <input
          size={12}
          type="text"
          placeholder={format(new Date(), "y-MM-dd")}
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          ref={buttonRef}
          type="button"
          aria-label="Pick a date"
          onClick={handleButtonClick}
        >
          Pick a date
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
            className="dialog-sheet border-[1px] border-orange-950"
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
