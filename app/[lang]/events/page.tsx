import ButtonCreateEvent from "@/components/ButtonCreateEvent/ButtonCreateEvent";
import EventsGallery from "@/components/EventsGallery/EventsGallery";
import React from "react";

const EventsPage = async () => {
  return (
    <section>
      <h1 className="w-full border-[1px] border-orange-950 text-center py-[20px]">
        Events Page
      </h1>

      <ButtonCreateEvent />

      <EventsGallery />
    </section>
  );
};

export default EventsPage;
