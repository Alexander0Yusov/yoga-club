import EventsGallery from "@/features/events/ui/EventsGallery";

const Page = ({
  params,
}: {
  params: { lang: string };
}) => {
  return (
    <EventsGallery
      lang={params.lang}
      showRouteTabs
      activeTab="upcoming"
      displayMode="upcoming"
    />
  );
};

export default Page;
