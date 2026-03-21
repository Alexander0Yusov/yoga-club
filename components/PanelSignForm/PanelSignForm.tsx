import { ReactNode } from "react";

interface PanelSignFormProps {
  children?: ReactNode;
  className?: string;
}

export const PanelSignForm = ({ children, className }: PanelSignFormProps) => {
  return (
    <div
      className={`border  w-[400px]  p-[50px] my-[20px] rounded-[20px] border-[#BFB3B9] bg-[#BFB2B9]/50 ${className}`}
    >
      {children}
    </div>
  );
};
// h-[730px]
