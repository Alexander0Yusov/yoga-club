"use client";
import React, { useState } from "react";
import { LocaleT } from "@/i18nConfig";
import { useRouter } from "next/navigation";

const SignupForm = ({ lang }: { lang: LocaleT }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [createdUser, setCreatedUser] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    setIsLoading(false);

    if (!res.ok) {
      setError(true);
    } else {
      setCreatedUser(true);
      router.push("/signin");
    }
  };

  return (
    <>
      {error && <p>Something went wrong. Please try again later.</p>}
      {!createdUser ? (
        <form
          className="flex flex-col border-[1px] border-orange-950"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col">
            Name
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
      ) : (
        <p>Account created! Now you can sign in.</p>
      )}
    </>
  );
};

export default SignupForm;
