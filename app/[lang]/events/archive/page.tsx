import React from "react";

import Container from "@/components/0_ui/Container/Container";
import LinksEventsPages from "@/components/0_ui/LinksEventsPages/LinksEventsPages";
import EventsGallery from "@/components/EventsGallery/EventsGallery";

const ArchiveEventsPage: React.FC = () => {
  return (
    <Container className=" pt-[50px] pb-[70px]">
      <h2 className=" mb-[30px] font-philosopher font-bold text-fs60 text-localbrown">
        Наші події
      </h2>

      <LinksEventsPages />

      {/* <EventsGallery /> */}
    </Container>
  );
};

export default ArchiveEventsPage;
