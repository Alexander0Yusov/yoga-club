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
      activeTab="archive"
      displayMode="archive"
    />
  );
};

export default Page;
