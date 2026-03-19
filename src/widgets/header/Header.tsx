import Link from "next/link";

import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ lang }: { lang: string }) {
  return (
    <header className="border-b border-[#dfbeaf] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href={`/${lang}`} className="text-lg font-semibold uppercase tracking-[0.2em] text-[#81453e]">
          Yoga Club
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[#497274] md:flex">
          <Link href={`/${lang}`}>Home</Link>
          <Link href={`/${lang}/events/upcoming`}>Upcoming</Link>
          <Link href={`/${lang}/events/archive`}>Archive</Link>
          <Link href={`/${lang}/account`}>Account</Link>
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
