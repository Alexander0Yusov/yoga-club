import Image from "next/image";

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

const ArchiveEventsPage = async () => {
  const getEvents = await import("@/api/events/route");
  const response = await getEvents.GET(
    new Request("https://yoga-club.local/api/events?viewMode=USER")
  );
  const events = (await response.json()) as EventRow[];
  const archive = events
    .filter(isVisible)
    .filter((event) => toDate(event).getTime() < Date.now())
    .sort((a, b) => toDate(b).getTime() - toDate(a).getTime());

  return (
    <>
      <BackButton />
      <FormCreateEvent />
      {archive.length > 0 ? (
        <EventsGallery events={archive} />
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
    </>
  );
};

export default ArchiveEventsPage;
