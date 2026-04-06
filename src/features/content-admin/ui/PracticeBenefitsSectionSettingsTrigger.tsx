"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { SectionRecord } from "@/shared/api/client";

import AdminCircleButton from "./AdminCircleButton";
import SectionEntitySettingsIcon from "./SectionEntitySettingsIcon";
import SectionSettingsModal from "./SectionSettingsModal";

type Props = {
  lang: string;
  section?: SectionRecord | null;
};

export default function PracticeBenefitsSectionSettingsTrigger({
  lang,
  section,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const sectionId = section?.id || section?._id;

  const refreshPage = useMemo(
    () => () => {
      router.refresh();
    },
    [router]
  );

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[70]">
        <div className="pointer-events-auto absolute left-4 bottom-0">
          <AdminCircleButton
            label="Редактировать секцию practice benefits"
            onClick={() => setOpen(true)}
            disabled={!sectionId}
          >
            <SectionEntitySettingsIcon active={open} />
          </AdminCircleButton>
        </div>
      </div>

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
