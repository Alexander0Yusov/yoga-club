"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

const HomeAncorsHeader = () => {
  const nav = usePathname();
  const { t } = useTranslation();

  const homePathArray = ["/en", "/de", "/"];

  return homePathArray.includes(nav) ? (
    <ul className="flex gap-[12px] ml-auto border-[1px] border-orange-950">
      <li>
        <Link href={"#directions"}>{t("HomeAncorsHeader_dirs")}</Link>
      </li>

      <li>
        <Link href={`#events`}>{t("HomeAncorsHeader_evnts")}</Link>
      </li>

      <li>
        <Link href={"#demovideos"}>{t("HomeAncorsHeader_vids")}</Link>
      </li>

      <li>
        <Link href={"#contactus"}>{t("HomeAncorsHeader_conts")}</Link>
      </li>
    </ul>
  ) : (
    <Link href={"/"} className="ml-auto border-[1px] border-orange-950">
      Головна
    </Link>
  );
};

export default HomeAncorsHeader;
