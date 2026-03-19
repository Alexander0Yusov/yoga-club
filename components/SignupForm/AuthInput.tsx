import { Dispatch, SetStateAction } from "react";

interface AuthInputProps {
  type: string;
  placeholder: string;
  nameTitle: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  className?: string;
  autoComplete?: string;
}

export const AuthInput = ({
  type,
  placeholder,
  nameTitle,
  value,
  setValue,
  className,
  autoComplete,
}: AuthInputProps) => {
  return (
    <label
      className={`flex flex-col w-full h-[84px] border-[1px] border-orange-950 ${className}`}
    >
      <span className="text-[18px] mb-auto">{nameTitle}</span>

      <input
        type={type}
        // name
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete={autoComplete}
        className="w-full h-[50px] px-[16px] py-[15px] text-[16px] border-[1px] border-[#BFB3B9] rounded-[10px]"
      />
    </label>
  );
};
