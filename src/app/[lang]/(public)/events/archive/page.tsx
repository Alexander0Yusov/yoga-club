import Image from "next/image";
import { headers } from "next/headers";

import BackButton from "@/shared/ui/BackButton/BackButton";
import EventsGallery from "@/features/events/ui/EventsGallery";
import { fetchPublicEvents, isArchiveEvent } from "@/features/events/model/publicEvents";
import noContentImage from "@/public/no-content.jpg";

const ArchiveEventsPage = async () => {
  const requestHeaders = headers();
  const forwardedHost =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProto =
    requestHeaders.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : "http://localhost:3000");

  const events = await fetchPublicEvents(siteUrl);
  const archive = events
    .filter(isArchiveEvent)
    .sort(
      (a, b) =>
        new Date(b.date || b.timeTarget || "").getTime() -
        new Date(a.date || a.timeTarget || "").getTime(),
    );

  return (
    <main className="space-y-6">
      <BackButton />

      {archive.length > 0 ? (
        <EventsGallery events={archive} linkToDetail />
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
    </main>
  );
};

export default ArchiveEventsPage;
