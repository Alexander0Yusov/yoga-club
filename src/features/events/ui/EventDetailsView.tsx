"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import useStore from "@/store/a_store";

import BackButton from "@/shared/ui/BackButton/BackButton";
import Container from "@/shared/ui/Container/Container";
import { ModalWindow } from "@/shared/ui/ModalWindow/ModalWindow";

import FormCreateEvent from "./FormCreateEvent";
import SwiperEvent from "./SwiperEvent";

type EventDetailsPic = {
  id: string;
  value: string;
  alt?: string;
};

type EventDetailsData = {
  _id: string;
  slug?: string;
  title?: string;
  description?: string;
  date?: string;
  timeTarget?: string;
  endTimeTarget?: string;
  location?: string;
  price?: string | number;
  imageUrl?: string;
  instagramUrl?: string;
  picsArray?: { _id?: string; value: string; alt?: string }[];
  defaultImg?: number;
};

type EventDetailsViewProps = {
  event: EventDetailsData;
  pictures: EventDetailsPic[];
  eventDate: string;
};

const isAdminUser = (role?: string, originalRole?: string) =>
  role === "ADMIN" ||
  role === "SUPERADMIN" ||
  originalRole === "SUPERADMIN";

export default function EventDetailsView({
  event,
  pictures,
  eventDate,
}: EventDetailsViewProps) {
  const user = useStore((state) => state.user);
  const { isFormEventOpen, setIsFormEventOpen } = useStore();
  const router = useRouter();
  const canEdit = isAdminUser(user?.role, user?.originalRole);

  const visiblePictures = useMemo(() => {
    if (pictures.length === 1) {
      return [pictures[0], pictures[0], pictures[0]];
    }

    if (pictures.length === 2) {
      return [...pictures, pictures[0]];
    }

    return pictures;
  }, [pictures]);

  return (
    <section className="py-8 md:py-10">
      <Container className="space-y-8">
        <BackButton />

        <header className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-[#497274]">
                Подія
              </p>
              <h1 className="font-philosopher text-[38px] font-bold leading-none text-localbrown md:text-[54px]">
                {event.title || "Подія"}
              </h1>
            </div>

            {canEdit && (
              <button
                type="button"
                onClick={() => setIsFormEventOpen(true)}
                className="h-[40px] rounded-none border border-[#81453e] px-5 text-[14px] text-[#81453e] transition-colors hover:bg-[#81453e] hover:text-white"
              >
                Редагувати подію
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-[15px] text-[#497274]">
            <p>
              <span className="font-medium text-[#2c2c2c]">Дата:</span>{" "}
              {eventDate || "—"}
            </p>
            {event.location && (
              <p>
                <span className="font-medium text-[#2c2c2c]">Локація:</span>{" "}
                {event.location}
              </p>
            )}
            {event.instagramUrl && (
              <p className="flex items-center gap-2">
                <span className="font-medium text-[#2c2c2c]">Більше:</span>
                <Link
                  href={event.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#497274] underline underline-offset-4"
                >
                  Instagram
                </Link>
              </p>
            )}
          </div>
        </header>

        <div className="space-y-6">
          <SwiperEvent pictures={visiblePictures} />

          {event.description && (
            <p className="max-w-[980px] text-[16px] leading-8 text-[#4f2a26]">
              {event.description}
            </p>
          )}
        </div>
      </Container>

      {canEdit && (
        <ModalWindow
          onModalClose={() => setIsFormEventOpen(false)}
          showModal={isFormEventOpen}
        >
          <FormCreateEvent
            id={event._id}
            timeTarget={event.timeTarget || event.date}
            endTimeTarget={event.endTimeTarget}
            title={event.title}
            description={event.description}
            instagramUrl={event.instagramUrl}
            picsArray={event.picsArray?.map(({ _id, value }) => ({
              id: _id || value,
              value,
              alt: event.title || "",
            }))}
            defaultImg={event.defaultImg}
            onSaved={() => router.refresh()}
          />
        </ModalWindow>
      )}
    </section>
  );
}
