"use client";

import { useEffect, useRef, useState } from "react";

import { setGoogleAuthLangCookie } from "@/shared/auth/google-auth-lang-cookie";

type GoogleButtonProps = {
  lang: string;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            login_uri: string;
            ux_mode: "redirect";
            auto_select?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with";
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: number;
              logo_alignment?: "left" | "center";
            },
          ) => void;
        };
      };
    };
  }
}

const SCRIPT_ID = "google-identity-services-sdk";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleButton({ lang }: GoogleButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setGoogleAuthLangCookie(lang);

    if (!GOOGLE_CLIENT_ID) {
      return;
    }

    const renderGoogleButton = () => {
      const google = window.google;

      if (!google?.accounts?.id || !containerRef.current) {
        return;
      }

      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        ux_mode: "redirect",
        login_uri: `${window.location.origin}/api/auth/callback/google`,
        auto_select: false,
      });

      containerRef.current.innerHTML = "";

      google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "pill",
        logo_alignment: "left",
        width: Math.min(window.innerWidth - 64, 400),
      });

      setIsReady(true);
    };

    const existingScript = document.getElementById(SCRIPT_ID);

    if (existingScript) {
      if (window.google) {
        renderGoogleButton();
      } else {
        existingScript.addEventListener("load", renderGoogleButton, { once: true });
      }

      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);
  }, [lang]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        className="flex w-full justify-center rounded-[10px] border border-orange-950 py-2 opacity-60"
        disabled
        type="button"
        title="NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured"
      >
        Google sign-in unavailable
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {!isReady && (
        <div className="flex h-[44px] items-center justify-center rounded-[10px] border border-orange-950/20 text-sm text-[#5e6972]">
          Preparing Google sign-in...
        </div>
      )}
      <div ref={containerRef} className="flex w-full justify-center" />
    </div>
  );
}

