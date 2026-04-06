"use client";

import React, { useState } from "react";
import { z } from "zod";
import { LocaleT } from "@/i18nConfig";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { createUserAccount, signInAccount } from "@/shared/api/client";
import { setAccessTokenCookie } from "@/shared/auth/access-token-cookie";
import { AuthInput } from "./AuthInput";

const signupSchema = z
  .object({
    email: z.string().trim().email("Введите корректный email"),
    password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
    confirmPassword: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignupForm = ({
  lang,
  callbackUrl,
}: {
  lang: LocaleT;
  callbackUrl?: string;
}) => {
  const router = useRouter();
  const destination = callbackUrl || `/${lang}/account`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validation = signupSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const message = validation.error.issues[0]?.message ?? "Invalid input";
      setError(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);

    try {
      await createUserAccount({
        email: validation.data.email,
        password: validation.data.password,
      });

      const authResult = await signInAccount<{
        accessToken: string;
      }>({
        email,
        password,
        rememberMe: true,
      });

      setAccessTokenCookie(authResult.accessToken);
      toast.success("Account created");
      router.replace(destination);
      router.refresh();
    } catch (error) {
      const status = (error as { status?: number }).status;
      const message =
        status === 409
          ? "Account already exists. Please sign in."
          : error instanceof Error && error.message
            ? error.message
            : "Network error. Please try again later.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-[15px]" onSubmit={handleSubmit}>
      {error && (
        <p className="text-sm text-red-600" aria-live="polite">
          {error}
        </p>
      )}

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

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 h-[50px] w-full rounded-[10px] border border-[#81453E] text-[16px] text-[#81453E] transition-colors hover:bg-[#81453E] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
