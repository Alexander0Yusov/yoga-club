"use client";

import React from "react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mb-[24px] rounded-full border border-localbrown bg-brown-light-light px-4 py-2 text-sm text-localbrown"
    >
      Назад
    </button>
  );
};

export default BackButton;
