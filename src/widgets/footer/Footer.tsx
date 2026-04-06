import Link from "next/link";

import type { LocaleT } from "@/i18nConfig";
import * as m from "@/paraglide/messages";
import Container from "@/shared/ui/Container/Container";
import IconFacebook from "@/shared/ui/IconFacebook";
import IconInstagram from "@/shared/ui/IconInstagram";
import IconTelegram from "@/shared/ui/IconTelegram";
import IconYutube from "@/shared/ui/IconYutube";
import Logo from "@/shared/ui/Logo";

const navLinks = [
  { href: "#directions", label: "Напрямки йоги" },
  { href: "#events", label: "Наші події" },
  { href: "#demovideos", label: "Відео галерея" },
] as const;

const socialLinks = [
  {
    href: "https://www.youtube.com/@user-me7xw1wf9x",
    label: "YouTube",
    icon: IconYutube,
  },
  {
    href: "https://www.facebook.com/profile.php?id=100017494006022",
    label: "Facebook",
    icon: IconFacebook,
  },
  {
    href: "https://www.instagram.com",
    label: "Instagram",
    icon: IconInstagram,
  },
  {
    href: "https://www.telegram.com",
    label: "Telegram",
    icon: IconTelegram,
  },
] as const;

type FooterProps = {
  lang: LocaleT;
};

export default function Footer({ lang }: FooterProps) {
  return (
    <footer id="footer" className="border-t border-[#81453e] bg-[#dfd9dc]">
      <Container className="grid gap-x-6 gap-y-5 py-5 text-[#2c2c2c] lg:grid-cols-[auto_minmax(0,190px)_minmax(0,220px)_auto] lg:items-start">
        <div className="pt-1">
          <Logo href={`/${lang}`} />
          <p className="mt-3 text-[13px] leading-5 text-[#2c2c2c]">
            {m.footer_rights(lang)}
          </p>
        </div>

        <nav className="pt-1 text-[15px] font-medium leading-6 md:text-[16px]">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={`/${lang}${link.href}`}
                  className="transition-colors hover:text-[#81453e]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className="pt-1">
          <h2 className="mb-3 text-[16px] font-medium text-[#81453e]">
            {m.footer_contacts_title(lang)}
          </h2>

          <div className="grid gap-2 text-[14px] leading-6 md:text-[15px]">
            <Link
              href="tel:+380955553322"
              className="transition-colors hover:text-[#81453e]"
            >
              +38 (095) 555 -33 -22
            </Link>
            <Link
              href="mailto:nadyakorableva@gmail.com"
              className="transition-colors hover:text-[#81453e]"
            >
              nadyakorableva@gmail.com
            </Link>
          </div>
        </section>

        <section className="pt-1 lg:justify-self-end">
          <h2 className="mb-3 text-[16px] font-medium text-[#81453e]">
            {m.footer_socials_title(lang)}
          </h2>

          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener nofollow"
                aria-label={label}
                className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#81453e] text-[#81453e] transition hover:bg-[#f5ebe4]"
              >
                <Icon />
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </footer>
  );
}
