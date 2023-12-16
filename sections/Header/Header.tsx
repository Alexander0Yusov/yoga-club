"use client";
import initTranslations from "@/app/[lang]/i18n";
import LanguageChanger from "@/components/LanguageChanger/LanguageChanger";
import Logo from "@/components/Logo/Logo";
import { TranslationsProvider } from "@/components/TranslationsProvider";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const i18nNamespaces = ["homePage"];

const Header = ({ lang }: { lang: any }) => {
  const [res, setRes] = useState({ t: null, resources: null });

  useEffect(() => {
    // желательно вернуть в статус серверного, это даст асинхр запрос. а сессию получить в клиентском подкомпоненте
    //const { t, resources } =
    initTranslations(lang, i18nNamespaces).then(
      ({ t = null, resources = null }) => setRes({ t, resources } as any)
    );
  }, []);

  const session = useSession();
  console.log(session);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={lang}
      resources={res?.resources}
    >
      <header className="flex justify-between items-center border-[1px] border-orange-950 h-[60px]">
        <Logo />
        <nav className="flex gap-3 border-[1px] border-orange-950 p-1">
          <Link href={`/${lang}`}>Home</Link>
          <Link href={`/${lang}/events`}>To events</Link>

          {session.status === "authenticated" && (
            <div className="flex gap-3 border-[1px] border-orange-950 ">
              <p>hi, {session.data.user?.email}</p>
              <button
                className="flex justify-center border-[1px] border-orange-950 "
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          )}
          {session.status === "unauthenticated" && (
            <div className="flex gap-3 border-[1px] border-orange-950 ">
              <Link href={`/${lang}/login`}>Login</Link>
              <Link href={`/${lang}/register`}>Register</Link>
            </div>
          )}
        </nav>

        <LanguageChanger />
      </header>
    </TranslationsProvider>
  );
};

export default Header;
