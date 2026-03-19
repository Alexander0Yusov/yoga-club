import Link from "next/link";

export default function Footer({ lang }: { lang: string }) {
  return (
    <footer className="border-t border-[#dfbeaf] bg-[#faf7f4]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-[#497274] sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-[#81453e]">Yoga Club</span>
          <Link href={`/${lang}/events/upcoming`}>Upcoming Gallery</Link>
          <Link href={`/${lang}/events/archive`}>Archive Gallery</Link>
          <Link href={`/${lang}/account`}>User Dashboard</Link>
        </div>
        <p>Global bookings and feedback stay independent from event IDs.</p>
      </div>
    </footer>
  );
}
