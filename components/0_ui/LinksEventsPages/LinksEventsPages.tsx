"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";
import React from "react";

const LinksEventsPages = () => {
  const pathname = usePathname();

  const pageDeterm = pathname.includes("archive");

  const commonStyle =
    "flex items-center justify-center rounded-[10px] w-[307px] h-[50px] font-mulish text-fs16 ";

  return (
    <nav>
      <ul className="flex gap-[16px] mb-[30px]">
        <li>
          <Link
            className={`${
              !pageDeterm
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
              pageDeterm
                ? commonStyle + " font-bold bg-cadetblue-light"
                : commonStyle + " text-cadetblue bg-cadetblue-light-light"
            }`}
            href="/events/archive"
          >
            Архів подій
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default LinksEventsPages;
