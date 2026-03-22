import React from "react";

import { LocaleT } from "@/i18nConfig";
import SigninForm from "@/features/auth/ui/SigninForm";
import { PanelSignForm } from "@/features/auth/ui/PanelSignForm";
import { TogglerSignMode } from "@/features/auth/ui/ToggleSignMode";
import { DividerLine } from "@/features/auth/ui/DividerLine";
import GoogleButton from "@/features/auth/ui/GoogleButton";

const LoginPage = ({ params: { lang } }: { params: { lang: LocaleT } }) => {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
      <PanelSignForm>
        <TogglerSignMode lang={lang} />

        <div className="mt-[10px] mb-[30px] flex h-0 w-full border-t-[1px] border-[#C57665]" />

        <SigninForm lang={lang} />

        <DividerLine />

        <GoogleButton />
      </PanelSignForm>
    </div>
  );
};

export default LoginPage;
