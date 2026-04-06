"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { HeroIntroRecord } from "@/shared/api/client";
import useStore from "@/store/a_store";
import IconPlus from "@/shared/ui/IconPlus";
import IconEdit from "@/shared/ui/IconEdit";
import IconDeleteFilled from "@/shared/ui/IconDeleteFilled";

import { getHeroIntroId } from "@/features/content-admin/model/getHeroIntroId";
import AdminCircleButton from "./AdminCircleButton";
import HeroIntroEditorModal from "./HeroIntroEditorModal";
import HeroIntroDeleteModal from "./HeroIntroDeleteModal";

type Props = {
  lang: string;
  heroIntro?: HeroIntroRecord | null;
};

export default function HeroSectionAdminControls({ lang, heroIntro }: Props) {
  const role = useStore((state) => state.user.role);
  const router = useRouter();
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";

  const [heroCreateOpen, setHeroCreateOpen] = useState(false);
  const [heroEditOpen, setHeroEditOpen] = useState(false);
  const [heroDeleteOpen, setHeroDeleteOpen] = useState(false);

  const heroId = getHeroIntroId(heroIntro);
  const hasHero = Boolean(heroId);

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
      <div className="pointer-events-none absolute left-0 top-[-47px] z-[70] flex items-center gap-[93px]">
        <div className="pointer-events-auto">
          <AdminCircleButton
            label="Добавить hero"
            onClick={() => setHeroCreateOpen(true)}
          >
            <IconPlus className="h-[36px] w-[36px] text-localbrown" />
          </AdminCircleButton>
        </div>
        <div className="pointer-events-auto">
          <AdminCircleButton
            label="Редактировать hero"
            onClick={() => setHeroEditOpen(true)}
            disabled={!hasHero}
          >
            <IconEdit className="h-[36px] w-[36px]" />
          </AdminCircleButton>
        </div>
        <div className="pointer-events-auto">
          <AdminCircleButton
            label="Удалить hero"
            onClick={() => setHeroDeleteOpen(true)}
            disabled={!hasHero}
          >
            <IconDeleteFilled className="h-[36px] w-[36px]" />
          </AdminCircleButton>
        </div>
      </div>

      <HeroIntroEditorModal
        showModal={heroCreateOpen}
        onClose={() => setHeroCreateOpen(false)}
        onSaved={refreshPage}
        lang={lang}
        mode="create"
      />

      <HeroIntroEditorModal
        showModal={heroEditOpen}
        onClose={() => setHeroEditOpen(false)}
        onSaved={refreshPage}
        lang={lang}
        heroIntro={heroIntro}
        mode="edit"
      />

      <HeroIntroDeleteModal
        showModal={heroDeleteOpen}
        onClose={() => setHeroDeleteOpen(false)}
        onDeleted={refreshPage}
        lang={lang}
        heroIntro={heroIntro}
      />
    </>
  );
}
