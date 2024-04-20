import React from "react";
import IconDraggable from "../0_ui/IconDraggable";
import IconDelete from "../0_ui/IconDelete";
import Image from "next/image";

const ImagesUrlList = ({
  picsArray,
  setPicsArray,
  className,
}: {
  picsArray: { id: string; value: string }[];
  setPicsArray: any;
  className?: string;
}) => {
  return (
    <ul className={"flex flex-col gap-[10px] text-fs16" + " " + className}>
      {picsArray?.length > 0 &&
        picsArray.map(({ id, value }, index) => (
          <li
            key={id}
            className="flex gap-[12px] justify-between items-center w-full h-[56px] py-[3px] border-[1px] border-orange-950 "
          >
            <IconDraggable />

            <p className=" min-w-[20px] text-center border-[1px] border-orange-950">
              {String(index + 1).padStart(2, "0")}
            </p>

            <div className=" relative flex justify-center items-center w-[50px] h-[50px] bg-lilac">
              {value &&
                (value.startsWith("https://") ||
                  value.startsWith("http://")) && (
                  <Image
                    src={value}
                    alt="event content"
                    width={50}
                    height={50}
                    sizes="(max-width: 768px) 15vw, (max-width: 1280px) 10vw, 5vw"
                    className="h-full w-full object-cover object-center"
                  />
                )}
            </div>

            <p className="self-end flex-[1] w-[120px] px-[16px] py-[8px] whitespace-nowrap overflow-hidden text-ellipsis border-b-[1px] border-brown-light ">
              {value}
            </p>

            <button
              className=" h-full"
              onClick={() =>
                setPicsArray(picsArray.filter((el: any) => el.id !== id))
              }
            >
              <IconDelete />
            </button>
          </li>
        ))}
    </ul>
  );
};

export default ImagesUrlList;
