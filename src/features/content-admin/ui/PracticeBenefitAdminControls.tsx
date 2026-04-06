"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import useStore from "@/store/a_store";
import type { PracticeBenefitRecord } from "@/shared/api/client";
import IconPlus from "@/shared/ui/IconPlus";
import IconEdit from "@/shared/ui/IconEdit";
import IconDeleteFilled from "@/shared/ui/IconDeleteFilled";

import AdminCircleButton from "./AdminCircleButton";
import PracticeBenefitEditorModal from "./PracticeBenefitEditorModal";
import PracticeBenefitDeleteModal from "./PracticeBenefitDeleteModal";
import { getPracticeBenefitId } from "@/features/content-admin/model/getPracticeBenefitId";

type Props = {
  lang: string;
  practiceBenefit?: PracticeBenefitRecord | null;
};

export default function PracticeBenefitAdminControls({
  lang,
  practiceBenefit,
}: Props) {
  const role = useStore((state) => state.user.role);
  const router = useRouter();
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const refreshPage = useMemo(
    () => () => {
      router.refresh();
    },
    [router]
  );

  const benefitId = getPracticeBenefitId(practiceBenefit);
  const hasBenefit = Boolean(benefitId);

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <div className="pointer-events-none absolute left-0 top-[-47px] z-[70] flex items-center gap-[93px]">
        <div className="pointer-events-auto">
          <AdminCircleButton
            label="Добавить benefit"
            onClick={() => setCreateOpen(true)}
          >
            <IconPlus className="h-[36px] w-[36px] text-localbrown" />
          </AdminCircleButton>
        </div>
        <div className="pointer-events-auto">
          <AdminCircleButton
            label="Редактировать benefit"
            onClick={() => setEditOpen(true)}
            disabled={!hasBenefit}
          >
            <IconEdit className="h-[36px] w-[36px]" />
          </AdminCircleButton>
        </div>
        <div className="pointer-events-auto">
          <AdminCircleButton
            label="Удалить benefit"
            onClick={() => setDeleteOpen(true)}
            disabled={!hasBenefit}
          >
            <IconDeleteFilled className="h-[36px] w-[36px]" />
          </AdminCircleButton>
        </div>
      </div>

      <PracticeBenefitEditorModal
        showModal={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={refreshPage}
        lang={lang}
        mode="create"
      />

      <PracticeBenefitEditorModal
        showModal={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={refreshPage}
        lang={lang}
        practiceBenefit={practiceBenefit}
        mode="edit"
      />

      <PracticeBenefitDeleteModal
        showModal={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={refreshPage}
        lang={lang}
        practiceBenefit={practiceBenefit}
      />
    </>
  );
}
