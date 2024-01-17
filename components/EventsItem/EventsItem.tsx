import Image from "next/image";
import Link from "next/link";
import React from "react";

import imageDefault from "@/public/default-event-1.jpg";

const EventsItem = ({ id, timeTarget, title, description, picsArray }: any) => {
  return (
    <Link href={`/events/${id}`}>
      <article className="flex gap-[16px] w-full border-[1px] border-orange-950">
        <div className="relative w-[414px] h-[250px] overflow-hidden border-[1px] border-orange-950">
          <Image
            src={picsArray[0]?.value || imageDefault}
            alt="one"
            width={414}
            height={250}
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 17vw"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className=" border-[1px] border-orange-950">
          <p className="text-gray text-sm my-2">{timeTarget}</p>

          <h4 className=" font-semibold mb-2">{title}</h4>

          <p>{description}</p>
        </div>
      </article>
    </Link>
  );
};

export default EventsItem;
