"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const GoogleButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <button
      className="flex justify-center w-full border-[1px] border-orange-950 py-2"
      disabled={false}
      onClick={() => signIn("google", { callbackUrl })}
      type="button"
    >
      Sign In with Google
    </button>
  );
};

export default GoogleButton;
