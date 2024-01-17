"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HomeAncorsHeader = () => {
  const nav = usePathname();

  const homePathArray = ["/en", "/de", "/"];

  return homePathArray.includes(nav) ? (
    <ul className="flex gap-[12px] ml-auto border-[1px] border-orange-950">
      <li>
        <Link href={"#directions"}>Напрямки йоги</Link>
      </li>

      <li>
        <Link href={`#events`}>Наші події</Link>
      </li>

      <li>
        <Link href={"#demovideos"}>Відео галерея</Link>
      </li>

      <li>
        <Link href={"#contactus"}>Контакти</Link>
      </li>
    </ul>
  ) : (
    <Link href={"/"} className="ml-auto border-[1px] border-orange-950">
      Головна
    </Link>
  );
};

export default HomeAncorsHeader;
