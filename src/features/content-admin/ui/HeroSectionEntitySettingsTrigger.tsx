"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { SectionRecord } from "@/shared/api/client";
import IconPlus from "@/shared/ui/IconPlus";
import useStore from "@/store/a_store";

import AdminCircleButton from "./AdminCircleButton";
import SectionSettingsModal from "./SectionSettingsModal";
import SectionEntitySettingsIcon from "./SectionEntitySettingsIcon";
import SectionEntityCreateModal from "./SectionEntityCreateModal";

type Props = {
  lang: string;
  section?: SectionRecord | null;
};

export default function HeroSectionEntitySettingsTrigger({
  lang,
  section,
}: Props) {
  const role = useStore((state) => state.user.role);
  const router = useRouter();
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
  const [sectionCreateOpen, setSectionCreateOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const refreshPage = useMemo(
    () => () => {
      router.refresh();
    },
    [router]
  );

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[70]">
        <div className="pointer-events-auto absolute left-4 bottom-0 flex flex-col items-start gap-4">
          <AdminCircleButton
            label="Добавить секцию"
            onClick={() => setSectionCreateOpen(true)}
          >
            <IconPlus className="h-[36px] w-[36px] text-localbrown" />
          </AdminCircleButton>

          <AdminCircleButton
            label="Редактировать секцию"
            onClick={() => setOpen(true)}
            disabled={false}
          >
            <SectionEntitySettingsIcon active={open} />
          </AdminCircleButton>
        </div>
      </div>

      <SectionEntityCreateModal
        showModal={sectionCreateOpen}
        onClose={() => setSectionCreateOpen(false)}
        onSaved={refreshPage}
        lang={lang}
      />

      <SectionSettingsModal
        showModal={open}
        onClose={() => setOpen(false)}
        onSaved={refreshPage}
        lang={lang}
        section={section}
      />
    </>
  );
}
