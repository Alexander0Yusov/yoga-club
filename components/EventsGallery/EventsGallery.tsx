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
          picsArray,
          createdAt,
        }: {
          _id: string;
          timeTarget: string;
          title: string;
          description: string;
          picsArray: [{ id: string; value: string }];
          createdAt: string;
        }) => (
          <li key={_id}>
            <EventsItem
              id={_id}
              timeTarget={timeTarget as string}
              title={title}
              description={description}
              picsArray={picsArray}
            />
          </li>
        )
      )}
    </ul>
  );
};

export default EventsGallery;
