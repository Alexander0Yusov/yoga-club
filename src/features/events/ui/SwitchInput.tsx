"use client";

import Image from "next/image";
import { nanoid } from "nanoid";
import { type Dispatch, type SetStateAction, useRef, useState } from "react";

type EventPicture = {
  id: string;
  value: string;
  alt?: string;
};

type SwitchInputProps = {
  picsArray: EventPicture[];
  setPicsArray: Dispatch<SetStateAction<EventPicture[]>>;
  className?: string;
};

const isPreviewValue = (value: string) =>
  value.startsWith("http://") ||
  value.startsWith("https://") ||
  value.startsWith("data:");

export default function SwitchInput({
  picsArray,
  setPicsArray,
  className,
}: SwitchInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpenInput, setIsOpenInput] = useState(false);
  const [altText, setAltText] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const resetForm = () => {
    setAltText("");
    setPreviewUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileSelect = (file?: File | null) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = () => {
    if (!previewUrl || !altText.trim()) {
      return;
    }

    setPicsArray([
      ...picsArray,
      {
        id: nanoid(),
        value: previewUrl,
        alt: altText.trim(),
      },
    ]);

    resetForm();
    setIsOpenInput(false);
  };

  if (isOpenInput) {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleAddPhoto();
        }}
        className={`flex w-full flex-col gap-3 bg-white px-[16px] py-[12px] text-fs16 ${className || ""}`.trim()}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center overflow-hidden bg-lilac">
            {isPreviewValue(previewUrl) ? (
              <Image
                src={previewUrl}
                alt={altText || "preview"}
                width={50}
                height={50}
                unoptimized={previewUrl.startsWith("data:")}
                className="h-full w-full object-cover object-center"
              />
            ) : null}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="h-[36px] border border-brown-light px-3 text-sm text-brown-light"
            >
              Вибрати фото
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFileSelect(event.target.files?.[0])}
            />

            <input
              type="text"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Alt текст"
              className="h-[36px] border-b border-brown-light px-3 text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsOpenInput(false);
            }}
            className="h-[30px] border border-brown-light px-3 text-xs uppercase text-brown-light"
          >
            Скасувати
          </button>

          <button
            type="submit"
            disabled={!previewUrl || !altText.trim()}
            className="h-[30px] border border-brown-light px-3 text-xs uppercase text-brown-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            ОК
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      type="button"
      className={`block w-full border border-localbrown bg-white px-[16px] py-[14px] text-left text-fs16 text-localbrown ${className || ""}`.trim()}
      onClick={() => setIsOpenInput(true)}
    >
      Додати фото
    </button>
  );
}
