"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { LocaleT } from "@/i18nConfig";
import { AuthInput } from "../SignupForm/AuthInput";
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";
import Link from "next/link";
import toast from "react-hot-toast";

const SigninForm = ({ lang }: { lang: LocaleT }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setCheched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [findUser, setFindUser] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("Credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.ok) {
      toast.success("Signed in successfully");
      window.location.href = `/${lang}/profile`;
      return;
    }

    toast.error("Invalid email or password");
    setError(true);
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
