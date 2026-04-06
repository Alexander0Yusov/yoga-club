"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { LocaleT } from "@/i18nConfig";

const TogglerSignMode = ({ lang }: { lang: LocaleT }) => {
  const pathname = usePathname();

  const signInPath = `/${lang}/signin`;
  const signUpPath = `/${lang}/signup`;

  const isSignIn = pathname.endsWith("/signin");
  const isSignUp = pathname.endsWith("/signup");

  return (
    <div className="flex gap-[20px]">
      <Link
        href={signInPath}
        className={`block h-[40px] text-center text-[36px] ${
          isSignIn
            ? "pointer-events-none font-bold text-[#81453E]"
            : "text-[#81453E]/40"
        }`}
        aria-disabled={isSignIn}
        tabIndex={isSignIn ? -1 : undefined}
      >
        Увійти
      </Link>

      <Link
        href={signUpPath}
        className={`block h-[40px] text-center text-[36px] ${
          isSignUp
            ? "pointer-events-none font-bold text-[#81453E]"
            : "text-[#81453E]/40"
        }`}
        aria-disabled={isSignUp}
        tabIndex={isSignUp ? -1 : undefined}
      >
        Реєстрація
      </Link>
    </div>
  );
};

export { TogglerSignMode };
