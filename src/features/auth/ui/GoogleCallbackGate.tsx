"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { googleLogin } from "@/shared/api/client";
import { setAccessTokenCookie } from "@/shared/auth/access-token-cookie";
import { clearGoogleAuthLangCookie } from "@/shared/auth/google-auth-lang-cookie";
import useStore from "@/store/a_store";

type GoogleCallbackGateProps = {
  lang: string;
  credential?: string;
  callbackUrl?: string;
};

export default function GoogleCallbackGate({
  lang,
  credential,
  callbackUrl,
}: GoogleCallbackGateProps) {
  const router = useRouter();
  const getCurrentUser = useStore((state) => state.getCurrentUser);
  const [message, setMessage] = useState("Authenticating with Google...");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        if (!credential) {
          throw new Error("Missing Google credential");
        }

        const authResult = await googleLogin<{ accessToken: string }>({
          idToken: credential,
        });

        if (cancelled) {
          return;
        }

        setAccessTokenCookie(authResult.accessToken);
        await getCurrentUser();
        clearGoogleAuthLangCookie();
        setMessage("Google sign-in succeeded, redirecting...");

        const destination = callbackUrl || `/${lang}/account`;
        router.replace(destination);
        router.refresh();
      } catch (error) {
        if (cancelled) {
          return;
        }

        clearGoogleAuthLangCookie();
        const destination = encodeURIComponent(callbackUrl || `/${lang}/account`);
        router.replace(`/${lang}/signin?googleError=1&callbackUrl=${destination}`);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [callbackUrl, credential, lang, router]);

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-[24px] border border-[#BFB3B9] bg-[#BFB2B9]/50 p-8 text-[#2f1815]"
      aria-busy="true"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#81453e]/20 border-t-[#81453e]" />
      <p className="text-sm text-[#5e6972]">{message}</p>
    </div>
  );
}
