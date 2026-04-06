"use client";

import Image from "next/image";
import { useMemo, useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";

import { updateUserBlacklist, updateUserViewMode } from "@/shared/api/client";
import useStore from "@/store/a_store";

type ViewMode = "USER" | "ADMIN" | "SUPERADMIN";
type RoleOption = "USER" | "ADMIN";

type UsersItemProps = {
  userId: string;
  num: number;
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
  showRoleColumn: boolean;
};

export default function UsersItem({
  userId,
  num,
  createdAt,
  image,
  portrait,
  name,
  nickname,
  phone,
  email,
  isAdmin = false,
  isSubscribed = false,
  lang,
  isInBlacklist = false,
  showRoleColumn,
}: UsersItemProps) {
  const currentUser = useStore((state) => state.user);
  const currentViewMode = (currentUser?.viewMode || currentUser?.role || "USER") as ViewMode;
  const isSuperAdmin =
    currentUser?.role === "SUPERADMIN" ||
    currentUser?.originalRole === "SUPERADMIN";

  const [status, setStatus] = useState(isInBlacklist);
  const [roleValue, setRoleValue] = useState<RoleOption>(
    isAdmin ? "ADMIN" : "USER",
  );

  const canManageUsers =
    currentViewMode === "ADMIN" || currentViewMode === "SUPERADMIN" || isSuperAdmin;

  const blacklistLabel = useMemo(() => (status ? "Заблокований" : "Активний"), [status]);
  const blacklistIcon = status ? "⛔" : "✅";

  const handlerBlackList = async () => {
    if (!canManageUsers) {
      toast.error("Admin permissions required");
      return;
    }

    try {
      await updateUserBlacklist({
        userEmail: email,
        isInBlacklist: !status,
      });

      setStatus(!status);
      toast.success("Blacklist status updated");
    } catch {
      toast.error("Blacklist update failed");
    }
  };

  const handlerRoleChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const nextRole = event.target.value as RoleOption;

    if (!isSuperAdmin) {
      toast.error("Superadmin permissions required");
      return;
    }

    try {
      await updateUserViewMode({
        id: userId,
        viewMode: nextRole,
      });

      setRoleValue(nextRole);
      toast.success("Role updated");
    } catch {
      toast.error("Role update failed");
    }
  };

  const date = createdAt ? new Date(createdAt).toISOString().slice(0, 10) : "-";

  return (
    <tr className="border-b border-lilac/40">
      <td className="px-2 py-3">{num + 1}</td>
      <td className="truncate px-2 py-3">{date}</td>
      <td className="px-2 py-3">
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-lilac">
          {image ? (
            <Image src={image} alt="user image" width={40} height={40} />
          ) : null}
        </div>
      </td>
      <td className="px-2 py-3">
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-lilac">
          {portrait ? (
            <Image src={portrait} alt="user portrait" width={40} height={40} />
          ) : null}
        </div>
      </td>
      <td className="truncate px-2 py-3">{name || "-"}</td>
      <td className="truncate px-2 py-3">{nickname || "-"}</td>
      <td className="truncate px-2 py-3">{phone || "-"}</td>
      <td className="truncate px-2 py-3">{email}</td>
      <td className="px-2 py-3">{isSubscribed ? "+" : "-"}</td>
      <td className="px-2 py-3 uppercase">{lang || "-"}</td>
      {showRoleColumn && (
        <td className="px-2 py-3">
          <select
            value={roleValue}
            onChange={handlerRoleChange}
            disabled={!isSuperAdmin}
            className="h-[32px] w-full rounded-[8px] border border-localbrown bg-brown-light-light px-2 text-[12px] text-localbrown disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </td>
      )}
      <td className="px-2 py-3">
        <button
          type="button"
          onClick={handlerBlackList}
          disabled={!canManageUsers}
          className="inline-flex items-center gap-2 rounded-[8px] border border-localbrown bg-brown-light-light px-2 py-1 text-[12px] text-localbrown disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{blacklistIcon}</span>
          <span>{blacklistLabel}</span>
        </button>
      </td>
    </tr>
  );
}
