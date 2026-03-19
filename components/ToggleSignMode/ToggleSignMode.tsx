"use client";
import Link from "next/link";

import { LocaleT } from "@/i18nConfig";
import { usePathname } from "next/navigation";

export const TogglerSignMode = ({ lang }: { lang: LocaleT }) => {
  const pathname = usePathname();

  const signInPath = `/${lang}/signin`;
  const signUpPath = `/${lang}/signup`;

  const isSignIn = pathname.endsWith("/signin");
  const isSignUp = pathname.endsWith("/signup");

  return (
    <div className="flex gap-[20px]">
      <Link
        href={signInPath}
        // pointer-events-none отключает клик, а opacity делает визуально неактивной
        className={`block text-center text-[36px] h-[40px] ${
          isSignIn
            ? "pointer-events-none text-[#81453E] font-bold"
            : "text-[#81453E]/40"
        }`}
        aria-disabled={isSignIn}
        tabIndex={isSignIn ? -1 : undefined}
      >
        Sign In
      </Link>

      <Link
        href={signUpPath}
        // pointer-events-none отключает клик, а opacity делает визуально неактивной
        className={`block text-center text-[36px] h-[40px] ${
          isSignUp
            ? "pointer-events-none text-[#81453E] font-bold"
            : "text-[#81453E]/40"
        }`}
        aria-disabled={isSignUp}
        tabIndex={isSignUp ? -1 : undefined}
      >
        Sign Up
      </Link>
    </div>
  );
};
