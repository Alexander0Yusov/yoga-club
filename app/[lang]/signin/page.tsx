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
    <PanelSignForm className="w-[400px]">
      <TogglerSignMode lang={lang} />

      <div className="flex w-full h-[0px] mt-[10px] mb-[30px] border-t-[1px] border-[#C57665]" />

      <SigninForm lang={lang} />

      <DividerLine />

      <GoogleButton />
    </PanelSignForm>
  );
};

export default LoginPage;
