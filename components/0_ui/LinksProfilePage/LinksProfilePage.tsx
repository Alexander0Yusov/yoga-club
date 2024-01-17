"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LinksProfilePage = () => {
  const pathname = usePathname();

  const pageDeterm = pathname.includes("feedbacks");

  const commonStyle =
    "flex items-center justify-center w-[160px] h-[40px] font-mulish text-fs16 rounded-t-[10px] border-[1px] border-b-0 border-cadetblue";

  return (
    <nav>
      <ul className="flex gap-[16px] border-b-[1px] border-cadetblue ">
        <li>
          <Link
            className={`${
              !pageDeterm
                ? commonStyle + " font-bold bg-cadetblue-light "
                : commonStyle + " text-cadetblue  "
            }`}
            href="/profile"
          >
            Особисті дані
          </Link>
        </li>

        <li>
          <Link
            className={`${
              pageDeterm
                ? commonStyle + " font-bold bg-cadetblue-light"
                : commonStyle + " text-cadetblue "
            }`}
            href="/profile/feedbacks"
          >
            Мої відгуки
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default LinksProfilePage;
