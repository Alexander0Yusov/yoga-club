import React from "react";
import Image from "next/image";

import IconDraggable from "@/shared/ui/IconDraggable";
import IconDelete from "@/shared/ui/IconDelete";

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
            className="flex h-[56px] w-full items-center justify-between gap-[12px] border-[1px] border-orange-950 py-[3px]"
          >
            <IconDraggable />

            <p className="min-w-[20px] border-[1px] border-orange-950 text-center">
              {String(index + 1).padStart(2, "0")}
            </p>

            <div className="relative flex h-[50px] w-[50px] items-center justify-center bg-lilac">
              {value &&
                (value.startsWith("https://") || value.startsWith("http://")) && (
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

            <p className="w-[120px] flex-[1] self-end overflow-hidden whitespace-nowrap border-b-[1px] border-brown-light px-[16px] py-[8px] text-ellipsis">
              {value}
            </p>

            <button className="h-full" onClick={() => setPicsArray(picsArray.filter((el: any) => el.id !== id))}>
              <IconDelete />
            </button>
          </li>
        ))}
    </ul>
  );
};

export default ImagesUrlList;
