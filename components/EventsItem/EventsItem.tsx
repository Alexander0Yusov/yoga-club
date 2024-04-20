import Image from "next/image";
import Link from "next/link";
import React from "react";

import { events_lib } from "@/lib/dataEvents";

const EventsItem = ({
  id,
  timeTarget,
  title,
  description,
  picsArray,
  defaultImg,
}: any) => {
  return (
    <Link href={`/events/${id}`}>
      <article className="flex justify-between w-full border-[1px] border-orange-950">
        <div className="relative w-[414px] h-[250px] overflow-hidden border-[1px] border-orange-950">
          <Image
            src={picsArray[0]?.value || events_lib[defaultImg || 0].value}
            alt="one"
            width={414}
            height={250}
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 17vw"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="flex flex-col w-[952px] text-fs18 border-[1px] border-orange-950">
          <p className=" font-bold ">{timeTarget}</p>

          <h3 className=" text-fs20 my-[16px]">{title}</h3>

          <p className=" h-[120px] overflow-hidden">
            {description.substring(0, 500) + "..."}
          </p>

          <p className="flex mt-auto ml-auto justify-center items-center text-fs16 w-[200px] h-[40px] border-[1px] border-localbrown bg-brown-light-light rounded-[10px]">
            Детальніше
          </p>
        </div>
      </article>
    </Link>
  );
};

export default EventsItem;
