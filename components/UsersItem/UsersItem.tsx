"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const UsersItem = ({
  num,
  createdAt,
  image,
  portrait,
  name,
  nickname,
  phone,
  email,
  isSubscribed,
  isInBlacklist,
}: {
  num: number;
  createdAt: string;
  image: string;
  portrait: string;
  name: string;
  nickname: string;
  phone: string;
  email: string;
  isSubscribed: boolean;
  isInBlacklist: boolean;
}) => {
  const [status, setStatus] = useState(isInBlacklist);

  const handlerBlackList = async () => {
    const deletingPromise = new Promise(async (resolve: any, reject) => {
      const result = await fetch("/api/usersAll", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email,
          isInBlacklist: !status,
        }),
      });

      if (result.ok) {
        setStatus(!status);

        resolve();
      } else reject();

      await toast.promise(
        deletingPromise,
        {
          loading: "Обробка даних...",
          success: "Дані збережено",
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
    });
  };

  let date = "";

  if (createdAt) {
    const originalDate = new Date(createdAt);

    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, "0");
    const day = String(originalDate.getDate()).padStart(2, "0");

    date = `${year}-${month}-${day}`;
  } else date = "-";

  return (
    <tr>
      <td>{num}</td>
      <td>{date}</td>
      <td>
        <div className=" relative flex justify-center items-center w-[40px] h-[40px] bg-lilac rounded-full overflow-hidden">
          {image && (
            <Image src={image} alt="user image" width={40} height={40} />
          )}
        </div>
      </td>
      <td>
        <div className=" relative flex justify-center items-center w-[40px] h-[40px] bg-lilac rounded-full overflow-hidden">
          {portrait && (
            <Image src={portrait} alt="user portrait" width={40} height={40} />
          )}
        </div>
      </td>
      <td>{name}</td>
      <td>{nickname}</td>
      <td>{phone}</td>
      <td>{email}</td>
      <td>{isSubscribed ? "+" : "-"}</td>
      <td>
        <button onClick={handlerBlackList}>{`${status ? "+" : "-"}`}</button>
      </td>
    </tr>
  );
};

export default UsersItem;
