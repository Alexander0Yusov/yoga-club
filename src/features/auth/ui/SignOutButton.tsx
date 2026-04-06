"use client";

import { useRouter } from "next/navigation";

import type { LocaleT } from "@/i18nConfig";
import { signOutAccount } from "@/shared/api/client";
import { clearAccessTokenCookie } from "@/shared/auth/access-token-cookie";
import useStore from "@/store/a_store";

type SignOutButtonProps = {
  lang: LocaleT;
};

const SignOutButton = ({ lang }: SignOutButtonProps) => {
  const router = useRouter();
  const resetUser = useStore((state) => state.resetUser);

  const handleSignOut = async () => {
    try {
      await signOutAccount();
    } catch {
      // Бэк может не принять logout без refresh cookie в локальной среде.
    }

    clearAccessTokenCookie();
    resetUser();
    router.replace(`/${lang}/signin`);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      className="inline-flex h-[44px] items-center justify-center rounded-full border border-[#81453e] px-5 text-sm font-medium text-[#81453e] transition-colors hover:bg-[#81453e] hover:text-white"
    >
      Вийти
    </button>
  );
};

export default SignOutButton;
