import Image from "next/image";
import { type Dispatch, type SetStateAction, useState } from "react";

import IconDraggable from "@/shared/ui/IconDraggable";
import IconDelete from "@/shared/ui/IconDelete";

type EventPicture = {
  id: string;
  value: string;
  alt?: string;
};

type ImagesUrlListProps = {
  picsArray: EventPicture[];
  setPicsArray: Dispatch<SetStateAction<EventPicture[]>>;
  className?: string;
};

const isImagePreview = (value: string) =>
  value.startsWith("http://") ||
  value.startsWith("https://") ||
  value.startsWith("data:");

const ImagesUrlList = ({
  picsArray,
  setPicsArray,
  className,
}: ImagesUrlListProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const moveItem = (from: number, to: number) => {
    if (from === to) {
      return;
    }

    setPicsArray((current) => {
      const next = [...current];
      const [picked] = next.splice(from, 1);

      if (!picked) {
        return current;
      }

      next.splice(to, 0, picked);
      return next;
    });
  };

  return (
    <ul className={`flex flex-col gap-[10px] text-fs16 ${className || ""}`.trim()}>
      {picsArray?.length > 0 &&
        picsArray.map(({ id, value, alt }, index) => (
          <li
            key={id}
            draggable
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggedIndex !== null) {
                moveItem(draggedIndex, index);
              }
              setDraggedIndex(null);
            }}
            className="flex h-[56px] w-full items-center gap-[12px] border border-localbrown bg-white py-[3px]"
          >
            <button
              type="button"
              className="cursor-grab px-[8px]"
              aria-label="Drag photo"
            >
              <IconDraggable />
            </button>

            <p className="min-w-[20px] text-center text-localbrown">
              {String(index + 1).padStart(2, "0")}
            </p>

            <div className="relative flex h-[50px] w-[50px] items-center justify-center overflow-hidden bg-lilac">
              {isImagePreview(value) ? (
                <Image
                  src={value}
                  alt={alt || "event content"}
                  width={50}
                  height={50}
                  unoptimized={value.startsWith("data:")}
                  sizes="(max-width: 768px) 15vw, (max-width: 1280px) 10vw, 5vw"
                  className="h-full w-full object-cover object-center"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-[1]">
              <p className="truncate border-b border-brown-light px-[16px] py-[8px] text-ellipsis">
                {alt || "Без alt"}
              </p>
            </div>

            <button
              type="button"
              className="h-full px-2"
              onClick={() =>
                setPicsArray((current) => current.filter((el) => el.id !== id))
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
