import { ReactNode } from "react";

interface PanelSignFormProps {
  children?: ReactNode;
  className?: string;
}

export const PanelSignForm = ({ children, className }: PanelSignFormProps) => {
  return (
    <div
      className={`mx-auto w-[400px] rounded-[20px] border border-[#BFB3B9] bg-[#BFB2B9]/50 p-[50px] my-[20px] ${className}`}
    >
      {children}
    </div>
  );
};
