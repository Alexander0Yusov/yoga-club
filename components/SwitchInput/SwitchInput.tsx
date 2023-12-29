"use client";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

const SwitchInput = ({
  picsArray,
  setPicsArray,
}: {
  picsArray: { id: string; value: string }[];
  setPicsArray: any;
}) => {
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
        setUrlImage("");
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
        <div className="flex gap-2 border-[1px] border-orange-700 touchOrCloseTargetEl">
          <button
            className="block border-[1px] border-orange-950 w-[24px] h-full"
            type="submit"
            onClick={handleAddUrl}
          >
            +
          </button>

          <button
            className="block border-[1px] border-orange-950 w-[24px] h-full"
            onClick={() => setIsOpenInput(!isOpenInput)}
          >
            -
          </button>

          {/* надо придумать автофокус для инпута после нажатия добавить */}
          <input
            type="text"
            placeholder="https://abcdef"
            value={urlImage}
            onChange={(e) => setUrlImage(e.target.value)}
          />
        </div>
      ) : (
        <button
          className="block w-full border-[1px] border-orange-700 "
          onClick={() => setIsOpenInput(!isOpenInput)}
        >
          Add picture
        </button>
      )}
    </>
  );
};

export default SwitchInput;
