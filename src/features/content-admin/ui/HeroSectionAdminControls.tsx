"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import type { HeroIntroRecord } from "@/shared/api/client";
import { getHeroIntroById } from "@/shared/api/client";
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
  const [editingHeroIntro, setEditingHeroIntro] = useState<HeroIntroRecord | null>(null);
  const [isHydratingEdit, setIsHydratingEdit] = useState(false);

  const heroId = getHeroIntroId(heroIntro);
  const hasHero = Boolean(heroId);

  useEffect(() => {
    if (!heroEditOpen) {
      setEditingHeroIntro(heroIntro ?? null);
    }
  }, [heroEditOpen, heroIntro]);

  const refreshPage = useMemo(
    () => () => {
      router.refresh();
    },
    [router]
  );

  const handleOpenEdit = async () => {
    if (!heroId) {
      return;
    }

    setEditingHeroIntro(null);
    setHeroEditOpen(true);
    setIsHydratingEdit(true);

    try {
      const record = await getHeroIntroById({
        id: heroId,
      });

      setEditingHeroIntro(record);
    } catch {
      toast.error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ hero");
    } finally {
      setIsHydratingEdit(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <div className="pointer-events-none absolute left-0 top-[-47px] z-[70] flex items-center gap-[93px]">
        <div className="pointer-events-auto">
          <AdminCircleButton
            label="Р”РѕР±Р°РІРёС‚СЊ hero"
            onClick={() => setHeroCreateOpen(true)}
          >
            <IconPlus className="h-[36px] w-[36px] text-localbrown" />
          </AdminCircleButton>
        </div>
        <div className="pointer-events-auto">
          <AdminCircleButton
            label="Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ hero"
            onClick={() => void handleOpenEdit()}
            disabled={!hasHero}
          >
            <IconEdit className="h-[36px] w-[36px]" />
          </AdminCircleButton>
        </div>
        <div className="pointer-events-auto">
          <AdminCircleButton
            label="РЈРґР°Р»РёС‚СЊ hero"
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
        heroIntro={editingHeroIntro}
        isHydrating={isHydratingEdit}
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
