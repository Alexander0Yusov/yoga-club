"use client";

import EventsModeTabs from "@/shared/ui/EventsModeTabs/EventsModeTabs";

type EventsTopPanelProps = {
  lang: string;
  activeTab: "upcoming" | "archive";
};

export default function EventsTopPanel({
  lang,
  activeTab,
}: EventsTopPanelProps) {
  return (
    <div className="mb-[24px]">
      <EventsModeTabs lang={lang} activeTab={activeTab} />
    </div>
  );
}
