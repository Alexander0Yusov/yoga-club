import Section from "@/components/0_ui/Section/Section";
import EventsGallery from "@/components/EventsGallery/EventsGallery";

const ProfileEventsPage = () => {
  return (
    <Section id="profile-events" className="pb-[100px] pt-[40px]">
      <EventsGallery linkToDetail={false} />
    </Section>
  );
};

export default ProfileEventsPage;
