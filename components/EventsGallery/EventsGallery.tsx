import React from "react";
import EventsItem from "../EventsItem/EventsItem";

const EventsGallery = async ({ events }: { events: any[] }) => {
  console.log(events);

  return (
    <ul className="flex flex-col w-full gap-[50px]">
      {events.map(
        ({
          _id,
          timeTarget,
          title,
          description,
          picsArray,
          defaultImg,
        }: {
          _id: string;
          timeTarget: string;
          title: string;
          description: string;
          picsArray: [{ id: string; value: string }];
          defaultImg: number;
        }) => (
          <li key={_id}>
            <EventsItem
              id={_id}
              timeTarget={timeTarget as string}
              title={title}
              description={description}
              picsArray={picsArray}
              defaultImg={defaultImg}
            />
          </li>
        )
      )}
    </ul>
  );
};

export default EventsGallery;
