import GoogleButton from "@/components/GoogleButton/GoogleButton";
import SigninForm from "@/components/SigninForm/SigninForm";
import { LocaleT } from "@/i18nConfig";

import Link from "next/link";
import React from "react";
import { PanelSignForm } from "../../../components/PanelSignForm/PanelSignForm";
import { TogglerSignMode } from "../../../components/ToggleSignMode/ToggleSignMode";
import { DividerLine } from "../../../components/DividerLine/DividerLine";

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
