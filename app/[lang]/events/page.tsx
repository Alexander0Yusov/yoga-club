import Container from "@/components/0_ui/Container/Container";
import LinksEventsPages from "@/components/0_ui/LinksEventsPages/LinksEventsPages";
import ButtonCreateEvent from "@/components/ButtonCreateEvent/ButtonCreateEvent";
import EventsGallery from "@/components/EventsGallery/EventsGallery";
import React from "react";

const EventsPage = async () => {
  return (
    <Container className=" pt-[50px] pb-[70px]">
      <h2 className=" mb-[30px] font-philosopher font-bold text-fs60 text-localbrown">
        Наші події
      </h2>

      <LinksEventsPages />

      <ButtonCreateEvent />

      <EventsGallery />
    </Container>
  );
};

export default EventsPage;
