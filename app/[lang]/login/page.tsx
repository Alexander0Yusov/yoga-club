"use client";
import { LocaleT } from "@/i18nConfig";
import credentials from "next-auth/providers/credentials";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

const LoginPage = ({ params: { lang } }: { params: { lang: LocaleT } }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [createdUser, setCreatedUser] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    signIn(credentials as any, { email, password, callbackUrl: "/" });

    setIsLoading(false);
  };

  return (
    <div className="py-[20px]">
      <h2>LoginPage</h2>
      {createdUser && <p>User created !!! Now you can login</p>}
      {error && <p>Something went wrong. Please try again later!</p>}
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
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
      <p className=" text-center my-[20px]">Or login with provider</p>
      <button
        className="flex justify-center w-full border-[1px] border-orange-950 py-2"
        disabled={isLoading}
        onClick={() => signIn("google", { callbackUrl: "/" })}
        type="button"
      >
        Login with Google
      </button>
      <Link className="block text-center mt-4" href={`/${lang}/register`}>
        Go to register
      </Link>
    </div>
  );
};

export default LoginPage;
