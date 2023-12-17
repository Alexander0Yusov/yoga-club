import GoogleButton from "@/components/GoogleButton/GoogleButton";
import SigninForm from "@/components/SigninForm/SigninForm";
import { LocaleT } from "@/i18nConfig";

import Link from "next/link";
import React from "react";

const LoginPage = ({ params: { lang } }: { params: { lang: LocaleT } }) => {
  return (
    <div className="py-[20px]">
      <h2 className="text-center">Sign In</h2>

      <SigninForm lang={lang} />

      <p className=" text-center my-[20px]">Or Sign In with provider</p>

      <GoogleButton />

      <Link className="block text-center mt-4" href={`/${lang}/signup`}>
        Go to Sign Up
      </Link>
    </div>
  );
};

export default LoginPage;
