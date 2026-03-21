"use client";
import React, { useState } from "react";
import { z } from "zod";
import { LocaleT } from "@/i18nConfig";
import { useRouter } from "next/navigation";
import { AuthInput } from "./AuthInput";

const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignupForm = ({ lang }: { lang: LocaleT }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const validation = signupSchema.safeParse({
      email,
      password,
      confirmPassword,
    });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Invalid input");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Something went wrong. Please try again later.");
        return;
      }

      setCreatedUser(true);
      router.push(`/${lang}/signin`);
    } catch {
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <p aria-live="polite">{error}</p>}
      {!createdUser ? (
        <form
          className="flex flex-col border-[1px] border-[#BFB3B9] "
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-[15px] w-full">
            <AuthInput
              type="email"
              placeholder="Email"
              nameTitle="Email"
              value={email}
              setValue={setEmail}
              autoComplete="email"
            />

            <AuthInput
              type="password"
              placeholder="Password"
              nameTitle="Password"
              value={password}
              setValue={setPassword}
              autoComplete="new-password"
            />

            <AuthInput
              type="password"
              placeholder="Confirm Password"
              nameTitle="Confirm Password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-[300px] h-[50px] self-center mt-[53px] text-[16px] border-[1px] border-[#81453E] rounded-[10px]"
          >
            Sign Up
          </button>
        </form>
      ) : (
        <p>Account created! Now you can sign in.</p>
      )}
    </>
  );
};

export default SignupForm;
