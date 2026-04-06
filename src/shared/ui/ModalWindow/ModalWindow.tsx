"use client";

import { useParams } from "next/navigation";

import { Portal } from "../Portal/Portal";
import type { ModalWindowProps } from "./types";
import IconClose from "../IconClose";

export const ModalWindow: React.FC<ModalWindowProps> = ({
  onModalClose,
  showModal,
  children,
  className = "",
}) => {
  const { lang }: { lang?: string } = useParams();

  return (
    <Portal onModalClose={onModalClose} showModal={showModal}>
      <div
        className={
          `container border-[1px] border-lilac rounded-[20px] relative z-40 my-10 bg-[#dfd9dc] px-[10px] pb-8 pt-[60px] md:px-4 lg:w-[1220px] lg:px-6 ` +
          className
        }
      >
        <button
          type="button"
          aria-label={
            (lang === "en" && "Modal close button") ||
            (lang === "uk" &&
              "Кнопка закриття модального вікна") ||
            "deutch button"
          }
          onClick={onModalClose}
          className="absolute right-[14px] top-[20px] z-20 h-fit w-fit md:right-[26px]"
        >
          <IconClose className="h-[30px] w-[30px]" />
        </button>
        <div
          className="max-h-[calc(100vh-80px-60px-32px)] overflow-auto px-[10px] md:px-4 lg:px-6"
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};
