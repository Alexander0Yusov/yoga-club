"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { confirmRegistration } from "@/shared/api/client";

type RegistrationConfirmationGateProps = {
  lang: string;
  code?: string;
};

type ViewState = "idle" | "loading" | "success" | "error";

export default function RegistrationConfirmationGate({
  lang,
  code,
}: RegistrationConfirmationGateProps) {
  const [state, setState] = useState<ViewState>(code ? "loading" : "idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!code) {
      setState("idle");
      setMessage("No confirmation code was found in the link.");
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        await confirmRegistration({ code, locale: lang });

        if (cancelled) {
          return;
        }

        setState("success");
        setMessage("Registration confirmed. You can sign in now.");
      } catch (error) {
        if (cancelled) {
          return;
        }

        setState("error");
        setMessage(
          error instanceof Error && error.message
            ? error.message
            : "Confirmation failed.",
        );
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5 rounded-[24px] border border-[#BFB3B9] bg-[#BFB2B9]/50 p-8 text-[#2f1815] shadow-[0_16px_50px_rgba(129,69,62,0.12)]">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[#81453e]">
          Registration
        </p>
        <h1 className="font-philosopher text-[36px] font-bold leading-tight">
          Confirm your email
        </h1>
        <p className="text-sm text-[#5e6972]">
          We are checking the code from your email and finishing the account activation.
        </p>
      </div>

      {state === "loading" && (
        <p className="rounded-2xl bg-white/70 p-4 text-sm text-[#5e6972]">
          Confirming your registration...
        </p>
      )}

      {state === "success" && (
        <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
          {message}
        </p>
      )}

      {state === "error" && (
        <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
          {message}
        </p>
      )}

      {state !== "loading" && (
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${lang}/signin`}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#81453e] px-5 text-sm font-medium text-[#81453e] transition-colors hover:bg-[#81453e] hover:text-white"
          >
            Go to sign in
          </Link>
          <Link
            href={`/${lang}/signup`}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#81453e]/30 px-5 text-sm font-medium text-[#81453e] transition-colors hover:bg-[#f8f2ef]"
          >
            Back to registration
          </Link>
        </div>
      )}
    </div>
  );
}
