import React from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CustomCheckbox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <label className="flex items-center cursor-pointer select-none group w-fit">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      <div
        className="
        w-[20px] h-[20px] 
        flex items-center justify-center 
        border-[1px] border-[#B6ADAF] 
        rounded-[4px] 
        transition-all duration-200
        peer-checked:border-[#81453E] 
        peer-focus-visible:ring-2 peer-focus-visible:ring-[#81453E]/30
      "
      >
        {checked && (
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.50002 5.56559C2.55794 6.74839 3.90501 10.9859 5.08251 8.95923C6.53116 6.46582 7.10428 3.5089 9.50002 1.5"
              stroke="#81453E"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <span className="ml-[10px] text-[14px]  text-[#1A1A1A] leading-none">
        {label}
      </span>
    </label>
  );
};

export default CustomCheckbox;
