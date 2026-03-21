import Image from "next/image";
import React from "react";

import BackButton from "@/components/0_ui/BackButton/BackButton";
import FormCreateEvent from "@/components/FormCreateEvent/FormCreateEvent";
import EventsGallery from "@/components/EventsGallery/EventsGallery";
import noContentImage from "@/public/no-content.jpg";

type EventRow = {
  _id: string;
  date?: string;
  timeTarget?: string;
  isActive?: boolean;
  deletedAt?: string | null;
};

const toDate = (event: EventRow) => new Date(event.date || event.timeTarget || "");

const isVisible = (event: EventRow) =>
  event.deletedAt == null && (event.isActive !== false);

const EventsPage = async () => {
  const getEvents = await import("../../../app/api/events/route");
  const response = await getEvents.GET(
    new Request("https://yoga-club.local/api/events?viewMode=USER")
  );
  const events = (await response.json()) as EventRow[];
  const upcoming = events
    .filter(isVisible)
    .filter((event) => toDate(event).getTime() >= Date.now())
    .sort((a, b) => toDate(a).getTime() - toDate(b).getTime());

  return (
    <div>
      <BackButton />
      <FormCreateEvent />

      {upcoming.length > 0 ? (
        <EventsGallery events={upcoming} />
      ) : (
        <>
          <div className="relative mx-auto mb-[40px] h-[400px] w-[400px] overflow-hidden border-[1px] border-orange-950">
            <Image
              src={noContentImage}
              alt="meditating woman"
              width={400}
              height={400}
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 17vw"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <p className="text-center font-bold text-fs24">Чекаємо на події</p>
        </>
      )}
    </div>
  );
};

export default EventsPage;
