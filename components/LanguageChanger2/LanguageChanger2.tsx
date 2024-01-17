"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { i18nConfig } from "@/i18nConfig";
import { useEffect, useState } from "react";

const LanguageChanger2 = () => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const [selected, setSelected] = useState("");

  useEffect(() => {
    setSelected(currentLocale);
  }, []);

  const handleChange = (newLocale: any) => {
    setSelected(newLocale);

    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "; expires=" + date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }

    router.refresh();
  };

  return (
    <ul
      id="LanguageSelector"
      className="flex gap-[4px] border-[1px] border-orange-700"
    >
      {["uk", "|", "en", "|", "de"].map((item, i) => (
        <li key={i} onClick={() => handleChange(item)}>
          {Boolean((i + 2) % 2 === 0) && (
            <span
              className={
                selected === item
                  ? "font-bold cursor-pointer"
                  : "cursor-pointer"
              }
            >
              {item.toUpperCase()}
            </span>
          )}

          {Boolean((i + 2) % 2 !== 0) && <span>{item}</span>}
        </li>
      ))}
    </ul>
  );
};

export default LanguageChanger2;
