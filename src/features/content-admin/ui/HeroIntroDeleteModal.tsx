"use client";

import toast from "react-hot-toast";

import type { HeroIntroRecord } from "@/shared/api/client";
import { softDeleteHeroIntro } from "@/shared/api/client";
import { ModalWindow } from "@/shared/ui/ModalWindow/ModalWindow";
import { getHeroIntroId } from "@/features/content-admin/model/getHeroIntroId";

type Props = {
  showModal: boolean;
  onClose: () => void;
  onDeleted?: () => void;
  lang: string;
  heroIntro?: HeroIntroRecord | null;
};

export default function HeroIntroDeleteModal({
  showModal,
  onClose,
  onDeleted,
  lang,
  heroIntro,
}: Props) {
  const heroId = getHeroIntroId(heroIntro);

  const handleDelete = async () => {
    if (!heroId) {
      onClose();
      return;
    }

    await toast.promise(
      softDeleteHeroIntro({
        id: heroId,
        locale: lang,
      }),
      {
        loading: "Удаляем hero...",
        success: "Hero удалён",
        error: "Не удалось удалить hero",
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
            Удаление hero
          </p>
          <p className="text-sm text-localbrown/80">
            Вы уверены, что хотите удалить сущность HeroIntro?
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
            disabled={!heroId}
            className="h-[40px] border border-localbrown bg-localbrown px-5 text-white disabled:opacity-60"
          >
            Удалить hero
          </button>
        </div>
      </div>
    </ModalWindow>
  );
}
