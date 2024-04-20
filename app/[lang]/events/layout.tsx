import Container from "@/components/0_ui/Container/Container";
import EventsTopPanel from "@/components/0_ui/EventsTopPanel/EventsTopPanel";
import LinksProfilePage from "@/components/0_ui/LinksProfilePage/LinksProfilePage";
import Section from "@/components/0_ui/Section/Section";
import SignOutButton from "@/components/0_ui/SignOutButton/SignOutButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yoga-club-events",
  description: "Generated by create next app",
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <Section id="events" className="pt-[40px] pb-[100px]">
        <h2 className=" mb-[30px] font-philosopher font-bold text-fs60 text-localbrown">
          Наші події
        </h2>

        <EventsTopPanel />

        {children}
      </Section>
    </Container>
  );
}
