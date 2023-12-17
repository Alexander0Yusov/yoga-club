import Link from "next/link";

import GoogleButton from "@/components/GoogleButton/GoogleButton";
import SignupForm from "@/components/SignupForm/SignupForm";

import { LocaleT } from "@/i18nConfig";

const RegisterPage = ({ params: { lang } }: { params: { lang: LocaleT } }) => {
  return (
    <div className="py-[20px]">
      <h2 className="text-center">Sign Up</h2>

      <SignupForm lang={lang} />

      <p className=" text-center my-[20px]">Or Sign Up with provider</p>

      <GoogleButton />

      <Link className="block text-center mt-4" href={`/${lang}/signin`}>
        Go to Sign In
      </Link>
    </div>
  );
};

export default RegisterPage;
