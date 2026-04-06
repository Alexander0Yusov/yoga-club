import React from "react";

import { LocaleT } from "@/i18nConfig";
import SigninForm from "@/features/auth/ui/SigninForm";
import { PanelSignForm } from "@/features/auth/ui/PanelSignForm";
import { TogglerSignMode } from "@/features/auth/ui/ToggleSignMode";
import { DividerLine } from "@/features/auth/ui/DividerLine";
import GoogleButton from "@/features/auth/ui/GoogleButton";

const LoginPage = ({
  params: { lang },
  searchParams,
}: {
  params: { lang: LocaleT };
  searchParams?: {
    callbackUrl?: string;
    sessionExpired?: string;
    googleError?: string;
  };
}) => {
  const sessionExpired = searchParams?.sessionExpired === "1";
  const googleError = searchParams?.googleError === "1";

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
      <PanelSignForm>
        <TogglerSignMode lang={lang} />

        <div className="mt-[10px] mb-[30px] flex h-0 w-full border-t-[1px] border-[#C57665]" />

        {sessionExpired && (
          <p className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Your session expired. Please sign in again.
          </p>
        )}

        {googleError && (
          <p className="mb-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Google sign-in failed. Please try again.
          </p>
        )}

        <SigninForm lang={lang} callbackUrl={searchParams?.callbackUrl} />

        <DividerLine />

        <GoogleButton lang={lang} />
      </PanelSignForm>
    </div>
  );
};

export default LoginPage;
