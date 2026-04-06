"use client";

import { useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import {
  mergeLocalizedTextPayload,
  resolveLocalizedText,
} from "@/features/content-admin/model/resolveLocalizedText";
import { saveSection, type SectionRecord } from "@/shared/api/client";
import { type SectionContentType } from "@/modules/sections/contracts/section.contract";

import SectionEntityForm, {
  type SectionEntityFormValues,
} from "./SectionEntityForm";

type Props = {
  showModal: boolean;
  onClose: () => void;
  onSaved?: () => void;
  lang: string;
  section?: SectionRecord | null;
};

export default function SectionSettingsModal({
  showModal,
  onClose,
  onSaved,
  lang,
  section,
}: Props) {
  const initialValues = useMemo<SectionEntityFormValues>(
    () => ({
      title: resolveLocalizedText(section?.title, lang, ""),
      subtitle_1: resolveLocalizedText(section?.subtitle_1, lang, ""),
      subtitle_2: resolveLocalizedText(section?.subtitle_2, lang, ""),
      for: typeof section?.for === "string" ? section.for : "",
      orderIndex: section?.orderIndex ?? 0,
      isActive: section?.isActive ?? true,
    }),
    [lang, section]
  );

  const onSubmit: SubmitHandler<SectionEntityFormValues> = async (values) => {
    const sectionId = section?.id || section?._id;

    await toast.promise(
      saveSection({
        id: sectionId,
        locale: lang,
        title: mergeLocalizedTextPayload(section?.title, values.title, lang),
        subtitle_1: values.subtitle_1.trim()
          ? mergeLocalizedTextPayload(
              section?.subtitle_1,
              values.subtitle_1.trim(),
              lang
            )
          : undefined,
        subtitle_2: values.subtitle_2.trim()
          ? mergeLocalizedTextPayload(
              section?.subtitle_2,
              values.subtitle_2.trim(),
              lang
            )
          : undefined,
        for: values.for as SectionContentType,
        orderIndex: values.orderIndex,
        isActive: Boolean(values.isActive),
      }),
      {
        loading: "Сохраняем секцию...",
        success: "Секция сохранена",
        error: "Не удалось сохранить секцию",
      }
    );

    onSaved?.();
    onClose();
  };

  return (
    <SectionEntityForm
      showModal={showModal}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Редактирование секции"
      description="Форма полностью совпадает с созданием секции и заполняется текущими значениями."
      submitLabel="Сохранить секцию"
      initialValues={initialValues}
    />
  );
}
