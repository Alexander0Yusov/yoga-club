"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import useStore from "@/store/a_store";
import ChevronDown from "../ChevronDown";

const EventsTopPanel = () => {
  const { isFormEventOpen, setIsFormEventOpen } = useStore();
  const user = useStore((state) => state.user);
  const { id: eventId } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const isArchivePage = pathname.includes("archive");
  const currentViewMode = user?.viewMode || user?.role || "USER";
  const canManageEvents =
    currentViewMode === "ADMIN" || currentViewMode === "SUPERADMIN";

  useEffect(() => {
    setIsFormEventOpen(false);
  }, [pathname, setIsFormEventOpen]);

  const handlerEventDelete = async () => {
    const isDelAllowed = confirm("Delete this event?");
    if (!isDelAllowed) return;

    const eventDeletePromise = new Promise(async (resolve, reject) => {
      const result = await fetch("/api/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId }),
      });

      if (result.ok) {
        resolve(null);
        router.push("/events");
      } else {
        reject(new Error("Delete failed"));
      }
    });

    await toast.promise(eventDeletePromise, {
      loading: "Deleting...",
      success: "Deleted",
      error: "Delete failed",
    });
  };

  const commonStyle =
    "flex h-[50px] w-[307px] items-center justify-center rounded-[10px] border-[1px] border-localbrown bg-brown-light-light font-mulish text-fs16";

  return (
    <nav className="flex justify-between">
      {!eventId && (
        <ul className="mb-[30px] flex gap-[16px]">
          <li>
            <Link
              className={`${
                !isArchivePage
                  ? `${commonStyle} font-bold bg-cadetblue-light`
                  : `${commonStyle} text-cadetblue bg-cadetblue-light-light`
              }`}
              href="/events"
            >
              Upcoming events
            </Link>
          </li>
          <li>
            <Link
              className={`${
                isArchivePage
                  ? `${commonStyle} font-bold bg-cadetblue-light`
                  : `${commonStyle} text-cadetblue bg-cadetblue-light-light`
              }`}
              href="/events/archive"
            >
              Archive
            </Link>
          </li>
        </ul>
      )}

      {canManageEvents && (
        <ul className="mb-[30px] flex gap-[16px]">
          <li>
            <button
              type="button"
              className="flex h-[50px] w-[307px] items-center justify-between gap-[8px] rounded-[10px] border-[1px] border-localbrown bg-brown-light-light px-[16px]"
              onClick={() => setIsFormEventOpen(!isFormEventOpen)}
            >
              <span>{eventId ? "Edit event" : "Add event"}</span>
              <ChevronDown
                className={
                  isFormEventOpen ? "rotate-180 w-[16px] h-auto" : "w-[16px] h-auto"
                }
              />
            </button>
          </li>

          {eventId && (
            <li>
              <button
                type="button"
                onClick={handlerEventDelete}
                className="flex h-[50px] w-[307px] items-center justify-center rounded-[10px] border-[1px] border-localbrown bg-brown-light-light"
              >
                Delete event
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default EventsTopPanel;
