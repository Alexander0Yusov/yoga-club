"use client";

import Link from "next/link";

type EventsModeTabsProps = {
  lang: string;
  activeTab: "upcoming" | "archive";
  className?: string;
};

const baseTabStyle =
  "flex h-[50px] w-full items-center justify-between border border-localbrown bg-brown-light-light px-4 font-mulish text-[16px] text-cadetblue transition-colors md:w-[307px]";

export default function EventsModeTabs({
  lang,
  activeTab,
  className = "",
}: EventsModeTabsProps) {
  const tabStyle = (tab: "upcoming" | "archive") =>
    `${baseTabStyle} ${
      activeTab === tab
        ? "bg-cadetblue-light font-bold"
        : "bg-cadetblue-light-light"
    }`;

  return (
    <nav className={`flex flex-col gap-3 md:flex-row md:gap-4 ${className}`.trim()}>
      <Link href={`/${lang}/events`} className={tabStyle("upcoming")}>
        <span>Анонси подій</span>
        <span>Детальніше</span>
      </Link>

      <Link href={`/${lang}/events/archive`} className={tabStyle("archive")}>
        <span>Архів подій</span>
        <span>Детальніше</span>
      </Link>
    </nav>
  );
}
