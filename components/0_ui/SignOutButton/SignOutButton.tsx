"use client";

import { signOut } from "next-auth/react";

const SignOutButton = () => {
  return (
    <button
      className="block w-[92px] h-[30px] ml-auto mt-[20px] rounded-[10px] border-[1px] border-localbrown text-localbrown"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Р’РёС…С–Рґ
    </button>
  );
};

export default SignOutButton;
