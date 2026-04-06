"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import useStore from "@/store/a_store";

function AuthHydrator() {
  const getCurrentUser = useStore((state) => state.getCurrentUser);
  const userStatusError = useStore((state) => state.userStatusError);
  const pathname = usePathname();
  const params = useParams<{ lang?: string }>();
  const router = useRouter();
  const hydratedRef = useRef(false);
  const handledSessionExpiredRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) {
      return;
    }

    hydratedRef.current = true;
    void getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    if (userStatusError !== "SESSION_EXPIRED") {
      handledSessionExpiredRef.current = false;
      return;
    }

    if (handledSessionExpiredRef.current) {
      return;
    }

    handledSessionExpiredRef.current = true;

    const lang = params?.lang || "en";
    const isAuthPage =
      pathname?.includes("/signin") ||
      pathname?.includes("/signup") ||
      pathname?.includes("/registration-confirmation") ||
      pathname?.includes("/password-recovery");

    toast.error("Session expired. Please sign in again.");

    if (!isAuthPage) {
      const callbackUrl = encodeURIComponent(pathname || `/${lang}`);
      router.replace(`/${lang}/signin?sessionExpired=1&callbackUrl=${callbackUrl}`);
    }
  }, [pathname, params, router, userStatusError]);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthHydrator />
      {children}
    </>
  );
}
