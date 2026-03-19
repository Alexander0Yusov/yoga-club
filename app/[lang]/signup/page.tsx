import GoogleButton from "@/components/GoogleButton/GoogleButton";
import SignupForm from "@/components/SignupForm/SignupForm";

import { LocaleT } from "@/i18nConfig";
import { PanelSignForm } from "../../../components/PanelSignForm/PanelSignForm";
import { TogglerSignMode } from "../../../components/ToggleSignMode/ToggleSignMode";
import { DividerLine } from "../../../components/DividerLine/DividerLine";

const RegisterPage = ({ params: { lang } }: { params: { lang: LocaleT } }) => {
  return (
    // рамка формы для регистрации
    <PanelSignForm>
      <TogglerSignMode lang={lang} />

      <div className="h-[0px] mt-[10px] mb-[30px] border-t-[1px] border-[#C57665]" />

      <SignupForm lang={lang} />

      <DividerLine />

      <GoogleButton />
    </PanelSignForm>
  );
};

export default RegisterPage;
