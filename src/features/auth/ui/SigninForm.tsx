"use client";

import React, { useState } from "react";
import { z } from "zod";
import { LocaleT } from "@/i18nConfig";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { signInAccount } from "@/shared/api/client";
import { setAccessTokenCookie } from "@/shared/auth/access-token-cookie";
import { AuthInput } from "./AuthInput";
import CustomCheckbox from "./CustomCheckbox";

const signInSchema = z.object({
  email: z.string().trim().email("Введите корректный email"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  rememberMe: z.boolean(),
});

const SigninForm = ({
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
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);

    const validation = signInSchema.safeParse({
      email,
      password,
      rememberMe,
    });

    if (!validation.success) {
      const message = validation.error.issues[0]?.message ?? "Invalid input";
      setError(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);

    try {
      const authResult = await signInAccount<{
        accessToken: string;
      }>({
        email: validation.data.email,
        password: validation.data.password,
        rememberMe: validation.data.rememberMe,
      });

      setAccessTokenCookie(authResult.accessToken);
      toast.success("Signed in successfully");
      router.replace(destination);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Invalid email or password";
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
        autoComplete="current-password"
      />

      <div className="mt-2 flex items-center justify-between gap-4">
        <CustomCheckbox
          label="Remember me"
          checked={rememberMe}
          onChange={setRememberMe}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 h-[50px] w-full rounded-[10px] border border-[#81453E] text-[16px] text-[#81453E] transition-colors hover:bg-[#81453E] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sign In
      </button>
    </form>
  );
};

export default SigninForm;
