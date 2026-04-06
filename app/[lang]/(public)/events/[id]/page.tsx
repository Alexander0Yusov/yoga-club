import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import EventDetailsView from "@/features/events/ui/EventDetailsView";
import { fetchPublicEvents, findEventById, type PublicEventRow } from "@/features/events/model/publicEvents";

function buildSiteUrl() {
  const requestHeaders = headers();
  const forwardedHost =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProto =
    requestHeaders.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");

  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : "http://localhost:3000")
  );
}

function formatEventDate(event: PublicEventRow, lang: string) {
  const sourceDate = event.date || event.timeTarget;

  if (!sourceDate) {
    return "—";
  }

  const parsed = new Date(sourceDate);

  if (Number.isNaN(parsed.getTime())) {
    return sourceDate;
  }

  const locale =
    lang === "ru"
      ? "ru-RU"
      : lang === "en"
        ? "en-GB"
        : lang === "de"
          ? "de-DE"
          : "uk-UA";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function normalizePictures(event: PublicEventRow) {
  const fromArray =
    event.picsArray?.map(({ _id, value, alt }) => ({
      id: _id || value,
      value,
      alt: alt || event.title || "",
    })) || [];

  const primary =
    event.imageUrl
      ? [{ id: `${event._id}-cover`, value: event.imageUrl }]
      : [];

  const fallbackMock = [
    "/default-event-1.jpg",
    "/default-event-2.jpg",
    "/default-event-3.jpg",
    "/default-event-4.jpg",
  ].map((value, index) => ({
    id: `${event._id}-mock-${index}`,
    value,
  }));

  const basePictures =
    fromArray.length > 0
      ? fromArray
      : primary.length > 0
        ? primary
        : fallbackMock;

  if (basePictures.length === 1) {
    return [basePictures[0], basePictures[0], basePictures[0]];
  }

  if (basePictures.length === 2) {
    return [...basePictures, basePictures[0]];
  }

  return basePictures;
}

async function resolveEvent(params: { lang: string; id: string }) {
  const siteUrl = buildSiteUrl();
  const events = await fetchPublicEvents(siteUrl);
  const event = findEventById(events, params.id);

  return { event, siteUrl };
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; id: string };
}): Promise<Metadata> {
  const { event } = await resolveEvent(params);

  if (!event) {
    return {
      title: "\u041f\u043e\u0434\u0456\u044f",
    };
  }

  return {
    title: `${event.title || "\u041f\u043e\u0434\u0456\u044f"} | Yoga Club`,
    description: event.description || undefined,
  };
}

export default async function EventDetailsPage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const { event } = await resolveEvent(params);

  if (!event) {
    notFound();
  }

  const eventPictures = normalizePictures(event);

  return (
    <EventDetailsView
      event={event}
      pictures={eventPictures}
      eventDate={formatEventDate(event, params.lang)}
    />
  );
}
