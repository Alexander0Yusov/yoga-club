"use client";

import { useEffect, useState } from "react";

import { getUsers } from "@/shared/api/client";
import useStore from "@/store/a_store";

import UsersItem from "./UsersItem";

type UserRow = {
  _id: string;
  createdAt: string;
  image?: string;
  portrait?: string;
  name?: string;
  nickname?: string;
  phone?: string;
  email: string;
  isAdmin?: boolean;
  isSubscribed?: boolean;
  lang?: string;
  isInBlacklist?: boolean;
};

export default function UsersGallery() {
  const currentUser = useStore((state) => state.user);
  const isSuperAdmin =
    currentUser?.role === "SUPERADMIN" ||
    currentUser?.originalRole === "SUPERADMIN";
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const result = await getUsers<UserRow[]>({ includeDeleted: true });
      setUsers(result);
    };

    void loadUsers();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[60px]" />
          <col className="w-[118px]" />
          <col className="w-[76px]" />
          <col className="w-[76px]" />
          <col className="w-[180px]" />
          <col className="w-[180px]" />
          <col className="w-[150px]" />
          <col className="w-[230px]" />
          <col className="w-[90px]" />
          <col className="w-[90px]" />
          {isSuperAdmin && <col className="w-[120px]" />}
          <col className="w-[120px]" />
        </colgroup>
        <thead>
          <tr className="h-[44px] text-left text-[12px] uppercase tracking-[0.08em] text-cadetblue">
            <th>No</th>
            <th>Created</th>
            <th>Photo</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Nickname</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Subscribed</th>
            <th>Lang</th>
            {isSuperAdmin && <th>Роль</th>}
            <th>Blacklist</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <UsersItem
              key={user._id}
              userId={user._id}
              num={index}
              createdAt={user.createdAt}
              image={user.image}
              portrait={user.portrait}
              name={user.name}
              nickname={user.nickname}
              phone={user.phone}
              email={user.email}
              isAdmin={Boolean(user.isAdmin)}
              isSubscribed={Boolean(user.isSubscribed)}
              lang={user.lang}
              isInBlacklist={Boolean(user.isInBlacklist)}
              showRoleColumn={isSuperAdmin}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
