"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HomeAncorsFooter = () => {
  const nav = usePathname();

  const homePathArray = ["/en", "/de", "/"];

  return (
    homePathArray.includes(nav) && (
      <ul>
        <li className="mb-[10px]">
          <Link href={"#directions"}>Напрямки йоги</Link>
        </li>

        <li className="mb-[10px]">
          <Link href={`#events`}>Наші події</Link>
        </li>

        <li>
          <Link href={"#demovideos"}>Відео галерея</Link>
        </li>
      </ul>
    )
  );
};

export default HomeAncorsFooter;
