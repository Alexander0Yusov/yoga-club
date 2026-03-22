"use client";

import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import Image from "next/image";

const SwitchInput = ({
  picsArray,
  setPicsArray,
  className,
}: {
  picsArray: { id: string; value: string }[];
  setPicsArray: any;
  className?: string;
}) => {
  const inputRef = useRef<any>(null);

  const [isOpenInput, setIsOpenInput] = useState(false);
  const [urlImage, setUrlImage] = useState("");

  useEffect(() => {
    const handlerClickOnNotTarget = (e: Event) => {
      const elementsInPropagationPath = e?.composedPath && e.composedPath();

      if (
        !elementsInPropagationPath.find((el: any) =>
          el?.classList?.contains("touchOrCloseTargetEl"),
        )
      ) {
        setIsOpenInput(false);
      }
    };

    const handlerKeydown = (e: any) => {
      if (e.code === "Escape") {
        setIsOpenInput(false);
      }
    };

    if (isOpenInput) {
      document.body.addEventListener("click", handlerClickOnNotTarget);
      window.addEventListener("keydown", handlerKeydown);

      inputRef?.current?.focus();
    } else {
      document.body.removeEventListener("click", handlerClickOnNotTarget);
      window.removeEventListener("keydown", handlerKeydown);
    }
  }, [isOpenInput]);

  const handleAddUrl = () => {
    urlImage && setPicsArray([...picsArray, { id: nanoid(), value: urlImage }]);

    setUrlImage("");
    setIsOpenInput(!isOpenInput);
  };

  return (
    <>
      {isOpenInput ? (
        <form
          onSubmit={handleAddUrl}
          className={
            "touchOrCloseTargetEl flex w-full items-center gap-[10px] bg-white px-[16px] py-[10px] text-fs16" +
            " " +
            className
          }
        >
          <label
            htmlFor="urlInput"
            className="w-[64px] overflow-hidden text-fs12"
          >
            Посилання на фото
          </label>

          <div className="relative flex h-[50px] w-[50px] items-center justify-center bg-lilac">
            {urlImage &&
              (urlImage.startsWith("https://") ||
                urlImage.startsWith("http://")) && (
                <Image
                  src={urlImage}
                  alt="event content"
                  width={50}
                  height={50}
                  sizes="(max-width: 768px) 15vw, (max-width: 1280px) 10vw, 5vw"
                  className="h-full w-full object-cover object-center"
                />
              )}
          </div>

          <input
            id="urlInput"
            ref={inputRef}
            type="text"
            placeholder="https:// ..."
            value={urlImage}
            onChange={(e) => setUrlImage(e.target.value)}
            className="h-[30px] flex-[1] self-end border-b-[1px] border-brown-light px-[8px] text-fs12"
          />

          <button
            className="block h-[30px] rounded-[5px] border-[1px] border-brown-light text-brown-light uppercase"
            type="button"
            onClick={() => setUrlImage("")}
          >
            clear
          </button>

          <button
            className="ml-auto block h-[30px] w-[30px] rounded-[5px] border-[1px] border-brown-light uppercase text-brown-light"
            type="submit"
            onClick={handleAddUrl}
          >
            ок
          </button>
        </form>
      ) : (
        <button
          className={"block w-full" + " " + className}
          onClick={() => setIsOpenInput(!isOpenInput)}
        >
          Додати фото
        </button>
      )}
    </>
  );
};

export default SwitchInput;
