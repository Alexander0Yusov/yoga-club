import { LocaleT } from "@/i18nConfig";
import Link from "next/link";
import React from "react";

const LoginPage = ({ params: { lang } }: { params: { lang: LocaleT } }) => {
  return (
    <div>
      <h2>LoginPage</h2>
      <form className="flex flex-col">
        <label className="flex flex-col">
          Email
          <input type="text" />
        </label>
        <label className="flex flex-col">
          Password
          <input type="text" />
        </label>
        <button>Send</button>
      </form>
      <Link href={`/${lang}/auth/register`}>Go to registration</Link>
    </div>
  );
};

export default LoginPage;
