import GoogleButton from "@/components/GoogleButton/GoogleButton";
import SignupForm from "@/components/SignupForm/SignupForm";

import { LocaleT } from "@/i18nConfig";
import { PanelSignForm } from "../../../components/PanelSignForm/PanelSignForm";
import { TogglerSignMode } from "../../../components/ToggleSignMode/ToggleSignMode";
import { DividerLine } from "../../../components/DividerLine/DividerLine";

const RegisterPage = ({ params: { lang } }: { params: { lang: LocaleT } }) => {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
      <PanelSignForm>
        <TogglerSignMode lang={lang} />

        <div className="mt-[10px] mb-[30px] h-0 w-full border-t-[1px] border-[#C57665]" />

        <SignupForm lang={lang} />

        <DividerLine />

        <GoogleButton />
      </PanelSignForm>
    </div>
  );
};

export default RegisterPage;
