import Container from "@/components/0_ui/Container/Container";
import LinksEventsPages from "@/components/0_ui/EventsTopPanel/EventsTopPanel";
import EventsGallery from "@/components/EventsGallery/EventsGallery";
import Image from "next/image";

import noContentImage from "@/public/no-content.jpg";
import FormCreateEvent from "@/components/FormCreateEvent/FormCreateEvent";

const ArchiveEventsPage = async () => {
  const getEvents = await import("../../../../app/api/events/route");
  const events = await (await getEvents.GET()).json();

  return (
    <>
      <FormCreateEvent />
      {events.length > 0 ? (
        <EventsGallery events={events} />
      ) : (
        <>
          <div className="relative w-[400px] h-[400px] mx-auto mb-[40px] overflow-hidden border-[1px] border-orange-950">
            <Image
              src={noContentImage}
              alt="meditating woman"
              width={400}
              height={400}
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 17vw"
              className="h-full w-full object-cover object-center"
            />
          </div>

          <p className=" text-center font-bold text-fs24">Чекаємо на події</p>
        </>
      )}
    </>
  );
};

export default ArchiveEventsPage;
