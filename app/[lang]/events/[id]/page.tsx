// import Image from "next/image";
import Container from "@/components/0_ui/Container/Container";
import EventsTopPanel from "@/components/0_ui/EventsTopPanel/EventsTopPanel";
import FormCreateEvent from "@/components/FormCreateEvent/FormCreateEvent";

import SwiperEvent from "@/components/SwiperEvent/SwiperEvent";
import React from "react";

import { events_lib } from "@/lib/dataEvents";

const EventPage = async ({ params: { id } }: { params: { id: string } }) => {
  const fetchEvent = await import("../../../api/event/route");

  const { timeTarget, title, description, picsArray, defaultImg } = await (
    await fetchEvent.GET(id as any)
  ).json();

  const arrayWithChanged_Id: any = picsArray?.map(
    ({ _id, value }: { _id: string; value: string }) => ({ id: _id, value })
  );

  // console.log(333, await getEvents_lib());
  // console.log(444, await [events_lib[defaultImg]]);

  return (
    <>
      <FormCreateEvent
        id={id}
        timeTarget={timeTarget}
        title={title}
        description={description}
        picsArray={arrayWithChanged_Id}
        defaultImg={defaultImg}
      />

      <h1 className=" mb-[30px] text-center text-fs24">{title}</h1>

      <div className="flex text-fs18 mb-[50px]">
        <p className=" w-[200px] mr-[10px] font-bold  text-center">
          {timeTarget}
        </p>
        <p>{description}</p>
      </div>

      <SwiperEvent
        pictures={
          arrayWithChanged_Id?.length > 0
            ? arrayWithChanged_Id
            : [events_lib[defaultImg]]
        }
      />
    </>
  );
};

export default EventPage;
