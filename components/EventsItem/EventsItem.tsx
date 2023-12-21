import Image from "next/image";
import Link from "next/link";
import React from "react";

const EventsItem = ({
  id,
  timeTarget,
  title,
  description,
  imageUrl,
  videoUrl,
}: any) => {
  return (
    <Link href={`/events/${id}`}>
      <article className="w-[200px] h-[400px] border-[1px] border-orange-950 overflow-hidden">
        <div className="relative  h-[200px] border-[1px] border-orange-950">
          <Image
            src={imageUrl}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw"
            style={{ objectFit: "cover" }}
            alt="d"
          />
        </div>
        <p className="text-gray text-sm my-2">{timeTarget}</p>

        <h4 className=" font-semibold mb-2">{title}</h4>

        <p>{description}</p>
      </article>
    </Link>
  );
};

export default EventsItem;
