"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LocaleT } from "@/i18nConfig";
import { AuthInput } from "../SignupForm/AuthInput";
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";
import Link from "next/link";

const SigninForm = ({ lang }: { lang: LocaleT }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setCheched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [findUser, setFindUser] = useState(false);

  const router = useRouter();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // const formData = new FormData(e.currentTarget);

    // await signIn("credentials", { email, password, callbackUrl: "/" });
    await signIn("Credentials", {
      email,
      password,
      // redirect: false,
      callbackUrl: "/",
    });

    setIsLoading(false);

    // res?.ok && setFindUser(true);
    // res?.error && setError(true);

    // if (res && !res.error) {
    //   router.push("/");
    // } else {
    //   console.log(res, lang);
    // }
  };

  return (
    <>
      {error && <p>Something went wrong. Please try again later.</p>}
      {!findUser ? (
        <form
          className="flex flex-col gap-[15px] border-[1px] border-orange-950"
          onSubmit={handleSubmit}
        >
          <AuthInput
            type="email"
            placeholder="Email"
            nameTitle="Email"
            value={email}
            setValue={setEmail}
          />

          <AuthInput
            type="password"
            placeholder="Password"
            nameTitle="Password"
            value={password}
            setValue={setPassword}
          />

          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center justify-between w-full mt-4">
              <CustomCheckbox
                label="Remind"
                checked={checked}
                onChange={setCheched}
              />

              <Link
                href="/forgot-password"
                className="text-[14px]  text-[#81453E] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[50px] text-[16px] border-[1px] border-[#81453E] rounded-[10px]"
            >
              {"Sign In"}
            </button>
          </div>
        </form>
      ) : (
        <p>Account confirmed</p>
      )}
    </>
  );
};

export default SigninForm;
