"use client";

import { useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import { createLocalizedTextPayload } from "@/features/content-admin/model/resolveLocalizedText";
import { saveSection } from "@/shared/api/client";
import {
  type SectionContentType,
} from "@/modules/sections/contracts/section.contract";

import SectionEntityForm, {
  type SectionEntityFormValues,
} from "./SectionEntityForm";

type Props = {
  showModal: boolean;
  onClose: () => void;
  onSaved?: () => void;
  lang: string;
};

export default function SectionEntityCreateModal({
  showModal,
  onClose,
  onSaved,
  lang,
}: Props) {
  const initialValues = useMemo<SectionEntityFormValues>(
    () => ({
      title: "",
      subtitle_1: "",
      subtitle_2: "",
      for: "",
      orderIndex: 0,
      isActive: true,
    }),
    []
  );

  const onSubmit: SubmitHandler<SectionEntityFormValues> = async (values) => {
    await toast.promise(
      saveSection({
        locale: lang,
        title: createLocalizedTextPayload(values.title, lang),
        subtitle_1: values.subtitle_1.trim()
          ? createLocalizedTextPayload(values.subtitle_1.trim(), lang)
          : undefined,
        subtitle_2: values.subtitle_2.trim()
          ? createLocalizedTextPayload(values.subtitle_2.trim(), lang)
          : undefined,
        for: values.for as SectionContentType,
        orderIndex: values.orderIndex,
        isActive: Boolean(values.isActive),
      }),
      {
        loading: "Создаём секцию...",
        success: "Секция создана",
        error: "Не удалось создать секцию",
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
      title="Создание секции"
      description="Заполните поля, чтобы создать новый блок контента. Тип секции определяет, где она будет использоваться на лендинге."
      submitLabel="Создать секцию"
      initialValues={initialValues}
    />
  );
}
