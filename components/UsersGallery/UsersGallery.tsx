"use client";

import React, { useEffect, useState } from "react";

import UsersItem from "../UsersItem/UsersItem";
import useStore from "@/store/a_store";

type UserRow = {
  _id: string;
  createdAt: string;
  image: string;
  portrait: string;
  name: string;
  nickname: string;
  phone: string;
  email: string;
  isAdmin?: boolean;
  isSubscribed: boolean;
  isInBlacklist: boolean;
};

const UsersGallery = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const user = useStore((state) => state.user);
  const isSuperAdmin =
    user?.email === "yusovsky2@gmail.com" ||
    user?.originalRole === "SUPERADMIN";

  useEffect(() => {
    const getUsers = async () => {
      const result = await fetch("/api/usersAll");

      if (result.ok) {
        const res = (await result.json()) as UserRow[];
        setUsers(res);
      }
    };

    getUsers();
  }, []);

  return (
    <div className="my-[20px] overflow-x-auto">
      <table className="w-full table-fixed">
        <colgroup>
          <col style={{ width: "44px" }} />
          <col style={{ width: "120px" }} />
          <col style={{ width: "70px" }} />
          <col style={{ width: "70px" }} />
          <col style={{ width: "170px" }} />
          <col style={{ width: "160px" }} />
          <col style={{ width: "145px" }} />
          <col style={{ width: "220px" }} />
          <col style={{ width: "100px" }} />
          {isSuperAdmin && <col style={{ width: "120px" }} />}
          <col style={{ width: "110px" }} />
        </colgroup>

        <thead>
          <tr className="h-[40px]">
            <th>No</th>
            <th>Created</th>
            <th>Photo</th>
            <th>Avatar</th>
            <th>
              <div style={{ resize: "horizontal", overflow: "auto" }}>Name</div>
            </th>
            <th>Nickname</th>
            <th>Phone</th>
            <th>
              <div style={{ resize: "horizontal", overflow: "auto" }}>Email</div>
            </th>
            <th>Subscribed</th>
            {isSuperAdmin && <th>Роль</th>}
            <th>Blacklist</th>
          </tr>
        </thead>

        <tbody>
          {users.map(
            (
              {
                _id,
                createdAt,
                image,
                portrait,
                name,
                nickname,
                phone,
                email,
                isAdmin,
                isSubscribed,
                isInBlacklist,
              },
              index
            ) => (
              <UsersItem
                key={_id}
                userId={_id}
                num={index}
                createdAt={createdAt}
                image={image}
                portrait={portrait}
                name={name}
                nickname={nickname}
                phone={phone}
                email={email}
                isAdmin={Boolean(isAdmin)}
                isSubscribed={isSubscribed}
                isInBlacklist={isInBlacklist}
                showRoleColumn={isSuperAdmin}
              />
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersGallery;
