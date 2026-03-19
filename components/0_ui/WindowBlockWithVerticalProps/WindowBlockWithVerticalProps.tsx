import { ReactNode } from "react";

interface WindowBlockWithVerticalParamsProps {
  children?: ReactNode;
  className?: string; // Позволяет передавать дополнительные стили снаружи
}

export const WindowBlockWithVerticalParams = ({
  children,
  className = "", // Значение по умолчанию, чтобы избежать undefined
}: WindowBlockWithVerticalParamsProps) => {
  return (
    // h-screen — это 100vh (вся высота вьюпорта)
    // w-full — на всякий случай, чтобы и по ширине растянуть
    <div
      className={`flex flex-col min-h-screen w-full border border-green-500 ${className}`}
    >
      {children} {/* Исправлено: вывод переменной children, а не строки */}
    </div>
  );
};
