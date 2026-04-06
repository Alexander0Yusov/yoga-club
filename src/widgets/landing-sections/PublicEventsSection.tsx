import Image from "next/image";
import Link from "next/link";

import eventsAnnounce from "@/public/events_announce.jpg";
import eventsArchive from "@/public/events_archive.jpg";
import Container from "@/shared/ui/Container/Container";

type PublicEventsSectionProps = {
  lang: string;
  title: string;
};

export default function PublicEventsSection({ lang, title }: PublicEventsSectionProps) {
  return (
    <section id="events" className="py-10 md:py-14">
      <Container className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-[#497274]">
            Наші події
          </p>
          <h2 className="font-philosopher text-[38px] font-bold leading-none text-localbrown md:text-[54px]">
            {title}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href={`/${lang}/events`}
            className="group relative block overflow-hidden border border-[#cdb2a8] bg-white"
          >
            <div className="relative aspect-[683/480] overflow-hidden bg-white">
              <Image
                src={eventsAnnounce}
                alt="Upcoming events"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-white/70 px-4 py-4 text-[#497274] backdrop-blur-[2px]">
              <span className="text-[24px] leading-none">Анонси подій</span>
              <span className="text-[18px] leading-none">Детальніше</span>
            </div>
          </Link>

          <Link
            href={`/${lang}/events/archive`}
            className="group relative block overflow-hidden border border-[#cdb2a8] bg-white"
          >
            <div className="relative aspect-[683/480] overflow-hidden bg-white">
              <Image
                src={eventsArchive}
                alt="Archive events"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-white/70 px-4 py-4 text-[#497274] backdrop-blur-[2px]">
              <span className="text-[24px] leading-none">Архів подій</span>
              <span className="text-[18px] leading-none">Детальніше</span>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}
