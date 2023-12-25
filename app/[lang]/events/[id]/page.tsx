import Image from "next/image";
import React from "react";

const EventPage = async ({ params: { id } }: { params: { id: string } }) => {
  const getEvent = await import("../../../api/event/route");

  const { timeTarget, title, description, picsArray, createdAt } = await (
    await getEvent.GET(id as any)
  ).json();

  return (
    <div id="EventDetails">
      <h1 className="text-center">{title}</h1>
      <p className="text-center">{createdAt}</p>
      <div className="relative w-[320px] h-[280px] mx-auto">
        <Image
          src={picsArray[0]?.value as string}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw"
          style={{ objectFit: "cover" }}
          alt={title}
        />
      </div>
      <p>{description}</p>
    </div>
  );
};

export default EventPage;
