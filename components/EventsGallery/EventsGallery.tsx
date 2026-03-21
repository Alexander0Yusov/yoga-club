"use client";

import React, { useEffect, useMemo, useState } from "react";

import { ModalWindow } from "../0_ui/ModalWindow/ModalWindow";
import FormCreateEvent from "../FormCreateEvent/FormCreateEvent";
import EventsItem from "../EventsItem/EventsItem";
import useStore from "@/store/a_store";
import {
  hardDeleteEventLifecycle,
  restoreEventLifecycle,
  softDeleteEventLifecycle,
  toggleEventVisibility,
} from "@/shared/api/client";

type EventRow = {
  _id: string;
  slug?: string;
  title?: string;
  date?: string;
  timeTarget?: string;
  description?: string;
  imageUrl?: string;
  picsArray?: { value: string }[];
  defaultImg?: number;
  isActive?: boolean;
  deletedAt?: string | null;
};

type EventsGalleryProps = {
  events?: EventRow[];
  linkToDetail?: boolean;
};

const EventsGallery = ({ events: externalEvents, linkToDetail = true }: EventsGalleryProps) => {
  const user = useStore((state) => state.user);
  const { isFormEventOpen, setIsFormEventOpen } = useStore();
  const [events, setEvents] = useState<EventRow[]>(externalEvents || []);
  const [showTrash, setShowTrash] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);
  const currentViewMode = user?.viewMode || user?.role || "USER";

  const isSuperAdmin =
    user?.email === "yusovsky2@gmail.com" ||
    user?.originalRole === "SUPERADMIN";
  const canModerate = currentViewMode === "ADMIN" || currentViewMode === "SUPERADMIN";
  const canHardDelete = isSuperAdmin;

  const eventsUrl = useMemo(() => {
    const params = new URLSearchParams({
      viewMode: currentViewMode,
    });

    if (showTrash && isSuperAdmin) {
      params.set("showTrash", "true");
    }

    return `/api/events?${params.toString()}`;
  }, [currentViewMode, isSuperAdmin, showTrash]);

  const reloadEvents = async () => {
    if (externalEvents?.length) {
      return;
    }

    const response = await fetch(eventsUrl, { cache: "no-store" });
    const result = (await response.json()) as EventRow[];
    setEvents(result);
  };

  useEffect(() => {
    if (externalEvents?.length) {
      setEvents(externalEvents);
      return;
    }

    void reloadEvents();
  }, [externalEvents, eventsUrl]);

  const openEditModal = (id: string) => {
    const event = events.find((item) => item._id === id) || null;
    setSelectedEvent(event);
    setIsFormEventOpen(true);
  };

  const closeEditModal = () => {
    setSelectedEvent(null);
    setIsFormEventOpen(false);
  };

  const handleToggleVisibility = async (id: string, nextState: boolean) => {
    setEvents((current) =>
      current.map((item) =>
        item._id === id ? { ...item, isActive: nextState } : item
      )
    );

    await toggleEventVisibility({
      id,
      isActive: nextState,
      viewMode: currentViewMode as "USER" | "ADMIN" | "SUPERADMIN",
    });
    await reloadEvents();
  };

  const handleSoftDelete = async (id: string) => {
    setEvents((current) =>
      current.map((item) =>
        item._id === id
          ? { ...item, isActive: false, deletedAt: new Date().toISOString() }
          : item
      )
    );

    await softDeleteEventLifecycle({
      id,
      viewMode: currentViewMode as "USER" | "ADMIN" | "SUPERADMIN",
    });
    await reloadEvents();
  };

  const handleRestore = async (id: string) => {
    setEvents((current) =>
      current.map((item) =>
        item._id === id ? { ...item, isActive: true, deletedAt: null } : item
      )
    );

    await restoreEventLifecycle({
      id,
      viewMode: currentViewMode as "USER" | "ADMIN" | "SUPERADMIN",
    });
    await reloadEvents();
  };

  const handleHardDelete = async (id: string) => {
    setEvents((current) => current.filter((item) => item._id !== id));

    await hardDeleteEventLifecycle({
      id,
      viewMode: currentViewMode as "USER" | "ADMIN" | "SUPERADMIN",
    });
    await reloadEvents();
  };

  return (
    <div className="space-y-5">
      {canModerate && (
        <div className="flex flex-wrap items-center gap-3">
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setShowTrash((value) => !value)}
              className="rounded-full border border-[#81453e] px-4 py-2 text-sm text-[#81453e]"
            >
              {showTrash ? "Hide deleted items" : "Show deleted items"}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setSelectedEvent(null);
              setIsFormEventOpen(true);
            }}
            className="rounded-full border border-[#497274] px-4 py-2 text-sm text-[#497274]"
          >
            Add event
          </button>
        </div>
      )}

      <ul className="flex flex-col gap-4">
        {events.map((item) => (
          <li key={item._id}>
            <EventsItem
              id={item._id}
              slug={item.slug}
              title={item.title || "Untitled event"}
              date={item.date}
              timeTarget={item.timeTarget}
              description={item.description}
              imageUrl={item.imageUrl}
              picsArray={item.picsArray}
              defaultImg={item.defaultImg}
              isActive={item.isActive !== false}
              deletedAt={item.deletedAt ?? null}
              canModerate={canModerate}
              canHardDelete={canHardDelete}
              onEdit={openEditModal}
              onToggleVisibility={handleToggleVisibility}
              onSoftDelete={handleSoftDelete}
              onRestore={handleRestore}
              onHardDelete={handleHardDelete}
              linkToDetail={linkToDetail}
            />
          </li>
        ))}
      </ul>

      <ModalWindow onModalClose={closeEditModal} showModal={isFormEventOpen}>
        <FormCreateEvent
          id={selectedEvent?._id}
          timeTarget={selectedEvent?.timeTarget || selectedEvent?.date}
          title={selectedEvent?.title}
          description={selectedEvent?.description}
          picsArray={selectedEvent?.picsArray as { id: string; value: string }[]}
          defaultImg={selectedEvent?.defaultImg}
        />
      </ModalWindow>
    </div>
  );
};

export default EventsGallery;
