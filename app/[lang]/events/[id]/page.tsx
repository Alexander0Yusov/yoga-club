import { notFound } from "next/navigation";

import BackButton from "@/components/0_ui/BackButton/BackButton";
import FormCreateEvent from "@/components/FormCreateEvent/FormCreateEvent";
import SwiperEvent from "@/components/SwiperEvent/SwiperEvent";
import { events_lib } from "@/lib/dataEvents";

type EventRow = {
  _id: string;
  slug?: string;
  date?: string;
  timeTarget?: string;
  title?: string;
  description?: string;
  picsArray?: { _id?: string; value: string }[];
  defaultImg?: number;
  isActive?: boolean;
  deletedAt?: string | null;
};

const isVisible = (event: EventRow) =>
  event.deletedAt == null && (event.isActive !== false);

const EventPage = async ({ params: { id } }: { params: { id: string } }) => {
  const getEvents = await import("@/api/events/route");
  const response = await getEvents.GET(
    new Request("https://yoga-club.local/api/events?viewMode=USER")
  );
  const events = (await response.json()) as EventRow[];
  const event = events.find(
    (item) =>
      isVisible(item) &&
      (item._id === id || item.slug === id)
  );

  if (!event) {
    notFound();
  }

  const arrayWithChangedId =
    event.picsArray?.map(({ _id, value }) => ({ id: _id || "", value })) || [];
  const eventDate = event.date || event.timeTarget || "";

  return (
    <>
      <BackButton />
      <FormCreateEvent
        id={id}
        timeTarget={eventDate}
        title={event.title}
        description={event.description}
        picsArray={arrayWithChangedId}
        defaultImg={event.defaultImg}
      />

      <h1 className="mb-[30px] text-center text-fs24">{event.title}</h1>

      <div className="mb-[50px] flex text-fs18">
        <p className="mr-[10px] w-[200px] text-center font-bold">
          {eventDate}
        </p>
        <p>{event.description}</p>
      </div>

      <SwiperEvent
        pictures={
          arrayWithChangedId.length > 0
            ? arrayWithChangedId
            : [events_lib[event.defaultImg || 0]]
        }
      />
    </>
  );
};

export default EventPage;
