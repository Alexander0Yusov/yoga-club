"use client";
import { LocaleT } from "@/i18nConfig";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

const RegisterPage = ({ params: { lang } }: { params: { lang: LocaleT } }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [createdUser, setCreatedUser] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError(true);
    } else {
      setCreatedUser(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="py-[20px]">
      <h2>RegisterPage</h2>
      {createdUser && <p>User created !!! Now you can login</p>}
      {error && <p>Something went wrong. Please try again later!</p>}
      <form
        className="flex flex-col border-[1px] border-orange-950"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col">
          Name
          <input type="text" placeholder="Name" />
        </label>

        <label className="flex flex-col">
          Email
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="flex flex-col">
          Password
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
      <p className=" text-center my-[20px]">Or register with provider</p>
      <button
        className="flex justify-center w-full border-[1px] border-orange-950 py-2"
        disabled={isLoading}
        onClick={() => signIn("google", { callbackUrl: "/" })}
        type="button"
      >
        Register with Google
      </button>
      <Link className="block text-center mt-4" href={`/${lang}/login`}>
        Go to login
      </Link>
    </div>
  );
};

export default RegisterPage;
