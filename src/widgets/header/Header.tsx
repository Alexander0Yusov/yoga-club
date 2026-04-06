import Link from "next/link";

import type { LocaleT } from "@/i18nConfig";
import * as m from "@/paraglide/messages";
import Container from "@/shared/ui/Container/Container";
import Logo from "@/shared/ui/Logo";

import HeaderAuthControl from "./HeaderAuthControl";
import LanguageSwitcher from "./LanguageSwitcher";

const navItems = [
  { href: (lang: string) => `/${lang}#hero`, label: m.nav_home },
  { href: (lang: string) => `/${lang}#about`, label: m.nav_about },
  { href: (lang: string) => `/${lang}#directions`, label: m.nav_practices },
  { href: (lang: string) => `/${lang}#events`, label: m.nav_schedule },
  { href: (lang: string) => `/${lang}#contactus`, label: m.nav_contacts },
] as const;

export default function Header({ lang }: { lang: LocaleT }) {
  return (
    <header className="relative sticky top-0 z-40 border-b border-[#bfb3b9] bg-[#bfb3b9]">
      <div className="absolute inset-x-0 top-0 h-[100px] bg-white/50" aria-hidden="true" />
      <Container className="relative grid h-[100px] grid-cols-[auto,1fr,auto] items-center gap-8">
        <Logo href={`/${lang}`} />

        <nav className="hidden items-center justify-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label(lang)}
              href={item.href(lang)}
              className="text-[18px] font-normal leading-[normal] text-black transition-opacity hover:opacity-70"
            >
              {item.label(lang)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <HeaderAuthControl lang={lang} />
          <LanguageSwitcher />
        </div>
      </Container>
    </header>
  );
}
