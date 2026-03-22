import { getPublicEvents } from "@/shared/api/client";

export type PublicEventRow = {
  _id: string;
  slug?: string;
  title?: string;
  description?: string;
  date?: string;
  timeTarget?: string;
  location?: string;
  price?: string | number;
  imageUrl?: string;
  picsArray?: { _id?: string; value: string }[];
  defaultImg?: number;
  isActive?: boolean;
  deletedAt?: string | null;
};

export const isVisibleEvent = (event: PublicEventRow) =>
  event.deletedAt == null && event.isActive !== false;

export const toEventDate = (event: PublicEventRow) =>
  new Date(event.date || event.timeTarget || "");

export const isUpcomingEvent = (event: PublicEventRow) =>
  isVisibleEvent(event) && toEventDate(event).getTime() >= Date.now();

export const isArchiveEvent = (event: PublicEventRow) =>
  isVisibleEvent(event) && toEventDate(event).getTime() < Date.now();

export async function fetchPublicEvents(siteUrl: string) {
  try {
    return await getPublicEvents<PublicEventRow[]>({ siteUrl });
  } catch {
    return [] as PublicEventRow[];
  }
}

export function findEventById(events: PublicEventRow[], id: string) {
  return events.find(
    (item) => isVisibleEvent(item) && (item._id === id || item.slug === id),
  );
}
