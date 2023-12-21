"use client";
import { LocaleT } from "@/i18nConfig";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const HeaderNavbar = ({ lang }: { lang: LocaleT }) => {
  const session = useSession();

  return (
    <nav className="flex gap-3 border-[1px] border-orange-700 p-1">
      <Link href={`/${lang}`}>Home</Link>
      <Link href={`/${lang}/events`}>To events</Link>

      {session.status === "authenticated" && (
        <div className="flex gap-3 border-[1px] border-orange-950 p-[1px]">
          <Link href={"/profile"} className=" border-[1px] border-orange-950 ">
            Profile {session.data.user?.email?.split("@")[0]}
          </Link>
          <button
            className=" border-[1px] border-orange-950 "
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      )}
      {session.status !== "authenticated" && (
        <div className="flex gap-3 border-[1px] border-orange-950 ">
          <Link href={`/${lang}/signin`}>Sign In</Link>
          <Link href={`/${lang}/signup`}>Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default HeaderNavbar;
