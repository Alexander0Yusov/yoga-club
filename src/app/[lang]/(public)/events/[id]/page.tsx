import Image from "next/image";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import BackButton from "@/shared/ui/BackButton/BackButton";
import SwiperEvent from "@/features/events/ui/SwiperEvent";
import { events_lib } from "@/lib/dataEvents";
import { fetchPublicEvents, findEventById } from "@/features/events/model/publicEvents";

type EventRow = {
  _id: string;
  slug?: string;
  date?: string;
  timeTarget?: string;
  title?: string;
  description?: string;
  picsArray?: { _id?: string; value: string }[];
  defaultImg?: number;
  imageUrl?: string;
};

const EventDetailsPage = async ({ params: { id } }: { params: { lang: string; id: string } }) => {
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
  const event = findEventById(events, id) as EventRow | undefined;

  if (!event) {
    notFound();
  }

  const pictures =
    event.picsArray?.map(({ _id, value }) => ({ id: _id || value, value })) ||
    [events_lib[event.defaultImg || 0]];
  const eventDate = event.date || event.timeTarget || "";

  return (
    <main className="space-y-6">
      <BackButton />

      <section className="rounded-[24px] border border-[#dfbeaf] bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="relative min-h-[280px] overflow-hidden rounded-[18px] border border-[#dfbeaf] bg-[#f9f3ef]">
            <Image
              src={event.imageUrl || pictures[0].value}
              alt={event.title || "Event"}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#497274]">
                Event
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-[#81453e]">
                {event.title || "Untitled event"}
              </h1>
              <p className="mt-2 text-sm text-[#c57665]">{eventDate}</p>
            </div>

            {event.description && (
              <p className="text-base leading-7 text-[#4f2a26]">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <SwiperEvent pictures={pictures} />
    </main>
  );
};

export default EventDetailsPage;
