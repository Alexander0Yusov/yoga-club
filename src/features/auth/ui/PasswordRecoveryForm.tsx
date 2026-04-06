"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { applyNewPassword } from "@/shared/api/client";
import { AuthInput } from "./AuthInput";

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must contain at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must contain at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordRecoveryFormProps = {
  lang: string;
  recoveryCode?: string;
};

export default function PasswordRecoveryForm({
  lang,
  recoveryCode,
}: PasswordRecoveryFormProps) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const hasRecoveryCode = Boolean(recoveryCode);

  const buttonLabel = useMemo(() => {
    if (!hasRecoveryCode) {
      return "Missing recovery code";
    }

    if (isLoading) {
      return "Updating...";
    }

    return "Set new password";
  }, [hasRecoveryCode, isLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!recoveryCode) {
      setStatus("error");
      setMessage("No recovery code was found in the link.");
      return;
    }

    const validation = passwordSchema.safeParse({
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      setStatus("error");
      setMessage(validation.error.issues[0]?.message ?? "Invalid password");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      await applyNewPassword({
        recoveryCode,
        newPassword: validation.data.newPassword,
        locale: lang,
      });

      setStatus("success");
      setMessage("Password has been updated. You can sign in now.");
      router.replace(`/${lang}/signin?passwordReset=1`);
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.message
          ? error.message
          : "Password recovery failed.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[#81453e]">
          Password recovery
        </p>
        <h1 className="font-philosopher text-[36px] font-bold leading-tight">
          Choose a new password
        </h1>
        <p className="text-sm text-[#5e6972]">
          Enter a new password for the recovery link you opened from email.
        </p>
      </div>

      {!hasRecoveryCode && (
        <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
          No recovery code was found in the URL.
        </p>
      )}

      {status === "error" && (
        <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
          {message}
        </p>
      )}

      {status === "success" && (
        <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
          {message}
        </p>
      )}

      <AuthInput
        type="password"
        placeholder="New password"
        nameTitle="New password"
        value={newPassword}
        setValue={setNewPassword}
        autoComplete="new-password"
      />

      <AuthInput
        type="password"
        placeholder="Confirm password"
        nameTitle="Confirm password"
        value={confirmPassword}
        setValue={setConfirmPassword}
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={!hasRecoveryCode || isLoading}
        className="mt-2 h-[50px] w-full rounded-[10px] border border-[#81453E] text-[16px] text-[#81453E] transition-colors hover:bg-[#81453E] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
