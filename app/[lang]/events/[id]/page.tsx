import Image from "next/image";
import React from "react";

const EventPage = async ({ params: { id } }: { params: { id: string } }) => {
  const getEvent = await import("../../../api/event/route");

  const obj: Record<string, string> = {};

  if (id) {
    const { timeTarget, title, description, imageUrl, videoUrl } = await (
      await getEvent.GET(id as any)
    ).json();

    obj.title = title;
    obj.timeTarget = timeTarget;
    obj.description = description;
    obj.imageUrl = imageUrl;
    obj.videoUrl = videoUrl;
  }

  return (
    <div id="EventDetails">
      <h1 className="text-center">{obj.title || "22"}</h1>
      <p className="text-center">{obj.timeTarget || "22"}</p>
      <div className="relative w-[320px] h-[280px] mx-auto">
        <Image
          src={obj.imageUrl || "22"}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw"
          style={{ objectFit: "cover" }}
          alt={obj.title || "22"}
        />
      </div>
      <p>{obj.description || "22"}</p>
    </div>
  );
};

export default EventPage;
