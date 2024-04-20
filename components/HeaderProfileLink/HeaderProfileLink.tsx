"use client";

import React, { useEffect } from "react";
import toast from "react-hot-toast";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

import IconProfile from "../0_ui/IconProfile";
import useStore from "@/store/a_store";

const HeaderProfileLink = () => {
  const session = useSession();
  const { user, getCurrentUser, userStatusLoading, userStatusError } =
    useStore();

  const imageSrc = session.data?.user?.image;
  const isAuth = session.status === "authenticated";

  useEffect(() => {
    const savingPromise = new Promise(async (resolve: any, reject) => {
      try {
        await getCurrentUser();
        resolve();
      } catch (error) {
        reject();
      }
    });

    const fetchData = async () => {
      await toast.promise(
        savingPromise,
        {
          loading: "Обробка профілю",
          success: "Профіль збережено",
          error: "Помилка збереження",
        },
        {
          success: {
            duration: 2500,
          },
          error: {
            duration: 4000,
          },
        }
      );
    };

    if (isAuth) {
      fetchData();
    }
  }, [isAuth, getCurrentUser]);

  return (
    <Link href={isAuth ? "/profile" : "/signin"} className=" mx-[12px] ">
      <div className=" relative flex justify-center items-center w-[30px] h-[30px]  bg-lilac rounded-full overflow-hidden">
        {imageSrc && (
          <Image
            src={user.portrait !== "" ? user.portrait : imageSrc}
            alt="user portrait"
            width={30}
            height={30}
          />
        )}
        {!imageSrc && <IconProfile />}
      </div>
    </Link>
  );
};

export default HeaderProfileLink;
