import React from "react";
import EventsItem from "../EventsItem/EventsItem";

const EventsGallery = async () => {
  const getEvents = await import("../../app/api/events/route");
  const events = await (await getEvents.GET()).json();
  return (
    <ul className="flex  flex-wrap w-full gap-[16px]">
      {events.map(
        ({
          _id,
          timeTarget,
          title,
          description,
          imageUrl,
          videoUrl,
        }: Record<string, string>) => (
          <li key={_id}>
            <EventsItem
              id={_id}
              timeTarget={timeTarget as string}
              title={title}
              description={description}
              imageUrl={imageUrl}
              videoUrl={videoUrl}
            />
          </li>
        )
      )}
    </ul>
  );
};

export default EventsGallery;
