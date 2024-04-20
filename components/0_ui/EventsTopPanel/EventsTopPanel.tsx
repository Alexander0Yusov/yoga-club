"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { useParams, usePathname, useRouter } from "next/navigation";
import ChevronDown from "../ChevronDown";

import useStore from "@/store/a_store";
import toast from "react-hot-toast";

const EventsTopPanel = () => {
  const { isFormEventOpen, setIsFormEventOpen } = useStore();
  const { id: eventId } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const isArchivePage = pathname.includes("archive");

  useEffect(() => {
    setIsFormEventOpen(false);
  }, [pathname]);

  const handlerEventDelete = async () => {
    let isDelAllowed = confirm("Підтверджуєте видалення?");
    if (!isDelAllowed) return;

    const eventDeletePromise = new Promise(async (resolve: any, reject) => {
      const result = await fetch("/api/event", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId }),
      });

      if (result.ok) {
        resolve();
        router.push("/events");
      } else reject();
    });

    await toast.promise(
      eventDeletePromise,
      {
        loading: "Триває обробка...",
        success: "Успішна обробка",
        error: "Помилка обробки",
      },
      {
        success: {
          duration: 2500,
        },
        error: {
          duration: 4000,
        },
      }
    );
  };

  const commonStyle =
    "flex items-center justify-center rounded-[10px] w-[307px] h-[50px] font-mulish text-fs16 ";

  return (
    <>
      <nav className="flex justify-between">
        {!eventId && (
          <ul className="flex gap-[16px] mb-[30px]">
            <li>
              <Link
                className={`${
                  !isArchivePage
                    ? commonStyle + " font-bold bg-cadetblue-light "
                    : commonStyle + " text-cadetblue bg-cadetblue-light-light "
                }`}
                href="/events"
              >
                Анонс подій
              </Link>
            </li>
            <li>
              <Link
                className={`${
                  isArchivePage
                    ? commonStyle + " font-bold bg-cadetblue-light"
                    : commonStyle + " text-cadetblue bg-cadetblue-light-light"
                }`}
                href="/events/archive"
              >
                Архів подій
              </Link>
            </li>
          </ul>
        )}

        <ul className="flex gap-[16px] mb-[30px]">
          <li>
            <button
              type="button"
              className="flex gap-[8px] justify-between items-center w-[307px] h-[50px] px-[16px] bg-brown-light-light border-[1px] border-localbrown rounded-[10px]"
              onClick={() => setIsFormEventOpen(!isFormEventOpen)}
            >
              {eventId ? (
                <span>Редагувати подію</span>
              ) : (
                <span>Додати подію</span>
              )}
              {isFormEventOpen ? (
                <ChevronDown className=" rotate-180 w-[16px] h-auto" />
              ) : (
                <ChevronDown className=" w-[16px] h-auto" />
              )}
            </button>
          </li>

          {eventId && (
            <li>
              <button
                type="button"
                onClick={handlerEventDelete}
                className="flex justify-center items-center w-[307px] h-[50px] bg-brown-light-light border-[1px] border-localbrown rounded-[10px]"
              >
                Видалити подію
              </button>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default EventsTopPanel;
