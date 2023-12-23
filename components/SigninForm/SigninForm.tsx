"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LocaleT } from "@/i18nConfig";

const SigninForm = ({ lang }: { lang: LocaleT }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          className="flex flex-col border-[1px] border-orange-950"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col">
            Email
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="flex flex-col">
            Password
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit" disabled={isLoading}>
            Send
          </button>
        </form>
      ) : (
        <p>Account confirmed</p>
      )}
    </>
  );
};

export default SigninForm;
