import React from "react";
import Arrow from "../0_ui/Arrow";

const ArrowsBlock = ({
  idPrevButton,
  idNextButton,
  className,
}: {
  idPrevButton: string;
  idNextButton: string;
  className?: string;
}) => {
  return (
    <div
      className={
        className +
        " flex justify-between w-[100px] h-[40px] px-[8px] rounded-full overflow-hidden border-[1px] border-brown-light-light"
      }
    >
      <button
        id={idPrevButton}
        className=" text-brown-light disabled:text-brown-light-light disabled:bg-transparent"
      >
        <Arrow className=" rotate-180" />
      </button>

      <button
        id={idNextButton}
        className=" text-brown-light disabled:text-brown-light-light disabled:bg-transparent"
      >
        <Arrow />
      </button>
    </div>
  );
};

export default ArrowsBlock;
