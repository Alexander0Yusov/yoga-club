"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

const MySessionProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default MySessionProvider;
