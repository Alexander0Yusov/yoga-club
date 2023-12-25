// import { format, isValid, parse } from "date-fns";
// import FocusTrap from "focus-trap-react";
// import { usePopper } from "react-popper";
// import React, { ChangeEventHandler, useRef, useState } from "react";
// import { DayPicker, SelectSingleEventHandler } from "react-day-picker";

// export default function DateTimePicker({
//   timeTarget,
//   setTimeTarget,
// }: {
//   timeTarget: string;
//   setTimeTarget: any;
// }) {
//   const [selected, setSelected] = useState<Date>();
//   const [inputValue, setInputValue] = useState<string>("");
//   const [isPopperOpen, setIsPopperOpen] = useState(false);

//   const popperRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
//     null
//   );

//   const popper = usePopper(popperRef.current, popperElement, {
//     placement: "bottom-start",
//   });

//   const closePopper = () => {
//     setIsPopperOpen(false);
//     buttonRef?.current?.focus();
//   };

//   const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
//     setInputValue(e.currentTarget.value);
//     const date = parse(e.currentTarget.value, "y-MM-dd", new Date());
//     if (isValid(date)) {
//       setSelected(date);
//       setTimeTarget(date);
//     } else {
//       setSelected(undefined);
//     }
//   };

//   const handleButtonClick = () => {
//     setIsPopperOpen(true);
//   };

//   const handleDaySelect: SelectSingleEventHandler = (date) => {
//     setSelected(date);
//     if (date) {
//       setInputValue(format(date, "y-MM-dd"));
//       closePopper();
//     } else {
//       setInputValue("");
//     }
//   };

//   return (
//     <div>
//       <div ref={popperRef}>
//         <input
//           size={12}
//           type="text"
//           placeholder={format(new Date(), "y-MM-dd")}
//           value={inputValue}
//           onChange={handleInputChange}
//         />
//         <button
//           ref={buttonRef}
//           type="button"
//           aria-label="Pick a date"
//           onClick={handleButtonClick}
//         >
//           Pick a date
//         </button>
//       </div>

//       {isPopperOpen && (
//         <FocusTrap
//           active
//           focusTrapOptions={{
//             initialFocus: false,
//             allowOutsideClick: true,
//             clickOutsideDeactivates: true,
//             onDeactivate: closePopper,
//             fallbackFocus: buttonRef.current || undefined,
//           }}
//         >
//           <div
//             tabIndex={-1}
//             style={popper.styles.popper}
//             className="dialog-sheet"
//             {...popper.attributes.popper}
//             ref={setPopperElement}
//             role="dialog"
//             aria-label="DayPicker calendar"
//           >
//             <DayPicker
//               initialFocus={isPopperOpen}
//               mode="single"
//               defaultMonth={selected}
//               selected={selected}
//               onSelect={handleDaySelect}
//             />
//           </div>
//         </FocusTrap>
//       )}
//     </div>
//   );
// }

// 2
import { useState } from "react";
import { format } from "date-fns";
import { uk, enUS, de } from "date-fns/locale";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DateTimePicker({
  timeTarget,
  setTimeTarget,
}: {
  timeTarget: string;
  setTimeTarget: any;
}) {
  const [selected, setSelected] = useState<Date>();

  let footer = <p>Please pick a day.</p>;
  if (selected) {
    footer = <p>You picked {format(selected, "PP")}.</p>;
  }

  const handleDayClick = (day: Date) => setSelected(day);

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      footer={footer}
      //

      onDayClick={handleDayClick}
      fromYear={2015}
      toYear={2025}
      captionLayout="dropdown-buttons"
      // numberOfMonths={2}
      // pagedNavigation
      showOutsideDays
      fixedWeeks
      locale={uk}
    />
  );
}
