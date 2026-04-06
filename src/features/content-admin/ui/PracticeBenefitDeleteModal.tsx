"use client";

import toast from "react-hot-toast";

import {
  softDeletePracticeBenefit,
  type PracticeBenefitRecord,
} from "@/shared/api/client";
import { ModalWindow } from "@/shared/ui/ModalWindow/ModalWindow";

import { getPracticeBenefitId } from "@/features/content-admin/model/getPracticeBenefitId";

type Props = {
  showModal: boolean;
  onClose: () => void;
  onDeleted?: () => void;
  lang: string;
  practiceBenefit?: PracticeBenefitRecord | null;
};

export default function PracticeBenefitDeleteModal({
  showModal,
  onClose,
  onDeleted,
  lang,
  practiceBenefit,
}: Props) {
  const benefitId = getPracticeBenefitId(practiceBenefit);

  const handleDelete = async () => {
    if (!benefitId) {
      onClose();
      return;
    }

    await toast.promise(
      softDeletePracticeBenefit({
        id: benefitId,
        locale: lang,
      }),
      {
        loading: "Удаляем benefit...",
        success: "Benefit удалён",
        error: "Не удалось удалить benefit",
      }
    );

    onDeleted?.();
    onClose();
  };

  return (
    <ModalWindow onModalClose={onClose} showModal={showModal}>
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.18em] text-localbrown">
            Удаление benefit
          </p>
          <p className="text-sm text-localbrown/80">
            Вы уверены, что хотите удалить сущность PracticeBenefit?
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-[40px] border border-localbrown px-5 text-localbrown"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={!benefitId}
            className="h-[40px] border border-localbrown bg-localbrown px-5 text-white disabled:opacity-60"
          >
            Удалить benefit
          </button>
        </div>
      </div>
    </ModalWindow>
  );
}
