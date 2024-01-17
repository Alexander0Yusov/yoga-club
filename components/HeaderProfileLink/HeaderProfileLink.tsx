"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import IconProfile from "../0_ui/IconProfile";
import { useSession } from "next-auth/react";
import Image from "next/image";

const HeaderProfileLink = () => {
  const session = useSession();

  const imageSrc = session.data?.user?.image;
  const isAuth = session.status === "authenticated";

  useEffect(() => {
    if (isAuth) {
    }
  }, [isAuth]);

  return (
    <Link href={isAuth ? "/profile" : "/signin"} className=" mx-[12px] ">
      <div className=" relative flex justify-center items-center w-[30px] h-[30px]  bg-lilac rounded-full overflow-hidden">
        {imageSrc && (
          <Image src={imageSrc} alt="user portrait" width={30} height={30} />
        )}
        {!imageSrc && <IconProfile />}
      </div>
    </Link>
  );
};

export default HeaderProfileLink;
