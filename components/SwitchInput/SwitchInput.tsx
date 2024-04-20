"use client";
import { useState, useEffect, useRef } from "react";
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
          el?.classList?.contains("touchOrCloseTargetEl")
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
  }, [isOpenInput, setIsOpenInput]);

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
            "touchOrCloseTargetEl w-full flex gap-[10px] items-center px-[16px] py-[10px] text-fs16 bg-white" +
            " " +
            className
          }
        >
          <label
            htmlFor="urlInput"
            className="w-[64px] text-fs12 overflow-hidden"
          >
            Посилання на фото
          </label>

          <div className=" relative flex justify-center items-center w-[50px] h-[50px] bg-lilac">
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
            className=" self-end flex-[1] h-[30px] px-[8px] text-fs12 border-b-[1px] border-brown-light"
          />

          <button
            className="block  h-[30px] text-brown-light uppercase border-[1px] border-brown-light rounded-[5px]"
            type="button"
            onClick={(e) => setUrlImage("")}
          >
            clear
          </button>

          <button
            className="block w-[30px] h-[30px] ml-auto text-brown-light uppercase border-[1px] border-brown-light rounded-[5px]"
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
