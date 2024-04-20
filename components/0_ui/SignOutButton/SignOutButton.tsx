"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SignOutButton = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  }, [session.status]);

  return (
    <button
      className="block w-[92px] h-[30px] ml-auto mt-[20px] rounded-[10px] border-[1px] border-localbrown text-localbrown"
      onClick={() => signOut()}
    >
      Вихід
    </button>
  );
};

export default SignOutButton;
