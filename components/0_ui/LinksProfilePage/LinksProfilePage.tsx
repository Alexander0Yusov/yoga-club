"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LinksProfilePage = () => {
  const pathname = usePathname();

  const commonStyle =
    "flex items-center justify-center w-[160px] h-[40px] font-mulish text-fs16 rounded-t-[10px] border-[1px] border-b-0 border-cadetblue";

  return (
    <nav>
      <ul className="flex gap-[16px] border-b-[1px] border-cadetblue ">
        <li>
          <Link
            className={`${
              pathname.endsWith("profile")
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
              pathname.includes("/myfeedbacks")
                ? commonStyle + " font-bold bg-cadetblue-light"
                : commonStyle + " text-cadetblue "
            }`}
            href="/profile/myfeedbacks"
          >
            Мої відгуки
          </Link>
        </li>

        <li>
          <Link
            className={`${
              pathname.includes("/feedbacks")
                ? commonStyle + " font-bold bg-cadetblue-light"
                : commonStyle + " text-cadetblue "
            }`}
            href="/profile/feedbacks"
          >
            Відгуки
          </Link>
        </li>

        <li>
          <Link
            className={`${
              pathname.includes("/demovideos")
                ? commonStyle + " font-bold bg-cadetblue-light"
                : commonStyle + " text-cadetblue "
            }`}
            href="/profile/demovideos"
          >
            Демо відео
          </Link>
        </li>

        <li>
          <Link
            className={`${
              pathname.includes("/users")
                ? commonStyle + " font-bold bg-cadetblue-light"
                : commonStyle + " text-cadetblue "
            }`}
            href="/profile/users"
          >
            Користувачі
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default LinksProfilePage;
