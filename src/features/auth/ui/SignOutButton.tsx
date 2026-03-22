"use client";

import { signOut } from "next-auth/react";

import type { LocaleT } from "@/i18nConfig";

type SignOutButtonProps = {
  lang: LocaleT;
};

const SignOutButton = ({ lang }: SignOutButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => void signOut({ callbackUrl: `/${lang}/signin` })}
      className="inline-flex h-[44px] items-center justify-center rounded-full border border-[#81453e] px-5 text-sm font-medium text-[#81453e] transition-colors hover:bg-[#81453e] hover:text-white"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
