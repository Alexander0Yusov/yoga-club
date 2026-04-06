"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import type { LocaleT } from "@/i18nConfig";
import * as m from "@/paraglide/messages";
import { signOutAccount } from "@/shared/api/client";
import IconProfile from "@/shared/ui/IconProfile";
import useStore from "@/store/a_store";

type HeaderAuthControlProps = {
  lang: LocaleT;
};

function getInitials(email?: string | null): string {
  return (email?.slice(0, 2).toUpperCase() || "U").padEnd(2, "");
}

export default function HeaderAuthControl({ lang }: HeaderAuthControlProps) {
  const messages = m.getMessages(lang);
  const router = useRouter();
  const user = useStore((state) => state.user);
  const resetUser = useStore((state) => state.resetUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const avatarAlt = useMemo(
    () => user?.name || user?.email || "User avatar",
    [user?.email, user?.name],
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSignOut = async () => {
    await signOutAccount();
    resetUser();
    setMenuOpen(false);
    router.replace(`/${lang}/signin`);
    router.refresh();
  };

  if (!user?.email) {
    return (
      <Link
        href={`/${lang}/signin`}
        aria-label={messages.btn_sign_in()}
        className="inline-flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-full bg-[#5e6972] text-white shadow-sm transition-transform hover:scale-[1.02]"
      >
        <IconProfile className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((value) => !value)}
        className="inline-flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-full bg-[#5e6972] text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={avatarAlt}
            width={30}
            height={30}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(user?.email)}</span>
        )}
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 min-w-44 rounded-[18px] border border-[#dfbeaf] bg-white p-2 shadow-[0_16px_40px_rgba(129,69,62,0.12)]">
          <Link
            href={`/${lang}/account`}
            onClick={() => setMenuOpen(false)}
            className="block rounded-full px-4 py-2 text-sm font-medium text-[#81453e] transition-colors hover:bg-[#f8f2ef]"
          >
            {messages.btn_profile()}
          </Link>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="block w-full rounded-full px-4 py-2 text-left text-sm font-medium text-[#81453e] transition-colors hover:bg-[#f8f2ef]"
          >
            {messages.btn_sign_out()}
          </button>
        </div>
      )}
    </div>
  );
}
