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
          el?.className?.includes("touchOrCloseTargetEl")
        )
      ) {
        setIsOpenInput(false);
        setUrlImage("");
      }
    };
    document.body.addEventListener("click", handlerClickOnNotTarget);
    return () =>
      document.body.removeEventListener("click", handlerClickOnNotTarget);
  }, []);

  useEffect(() => {
    const handlerKeydown = (e: any) => {
      if (e.code === "Escape") {
        setIsOpenInput(false);
      }
    };
    window.addEventListener("keydown", handlerKeydown);
    return () => {
      window.removeEventListener("keydown", handlerKeydown);
    };
  }, [setIsOpenInput]);

  const handleSubmit = () => {
    urlImage &&
      setPicsArray((prev: any) => [...prev, { id: nanoid(), value: urlImage }]);

    setUrlImage("");
    setIsOpenInput(!isOpenInput);
  };

  return (
    <>
      {isOpenInput ? (
        <form
          className="flex gap-2 border-[1px] border-orange-700 touchOrCloseTargetEl"
          onSubmit={handleSubmit}
        >
          <button
            className="block border-[1px] border-orange-950 w-[24px] h-full"
            type="submit"
            onClick={handleSubmit}
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
        </form>
      ) : (
        <p
          className="border-[1px] border-orange-700 "
          onClick={() => setIsOpenInput(!isOpenInput)}
        >
          Add picture
        </p>
      )}
    </>
  );
};

export default SwitchInput;
