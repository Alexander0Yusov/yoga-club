"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  createLocalizedTextPayload,
  mergeLocalizedTextPayload,
  resolveLocalizedText,
} from "@/features/content-admin/model/resolveLocalizedText";
import {
  savePracticeBenefit,
  type PracticeBenefitRecord,
} from "@/shared/api/client";
import { ModalWindow } from "@/shared/ui/ModalWindow/ModalWindow";
import { getPracticeBenefitId } from "@/features/content-admin/model/getPracticeBenefitId";

const textFields = [
  "text_1",
  "text_2",
  "text_3",
  "text_4",
  "text_5",
  "text_6",
  "text_7",
  "text_8",
  "text_9",
  "text_10",
] as const;

const schema = z.object({
  text_1: z.string().trim().min(1, "Введите первый текст"),
  text_2: z.string().trim(),
  text_3: z.string().trim(),
  text_4: z.string().trim(),
  text_5: z.string().trim(),
  text_6: z.string().trim(),
  text_7: z.string().trim(),
  text_8: z.string().trim(),
  text_9: z.string().trim(),
  text_10: z.string().trim(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  showModal: boolean;
  onClose: () => void;
  onSaved?: () => void;
  lang: string;
  practiceBenefit?: PracticeBenefitRecord | null;
  mode: "create" | "edit";
};

const textFieldLabels: Record<(typeof textFields)[number], string> = {
  text_1: "Текст 1",
  text_2: "Текст 2",
  text_3: "Текст 3",
  text_4: "Текст 4",
  text_5: "Текст 5",
  text_6: "Текст 6",
  text_7: "Текст 7",
  text_8: "Текст 8",
  text_9: "Текст 9",
  text_10: "Текст 10",
};

export default function PracticeBenefitEditorModal({
  showModal,
  onClose,
  onSaved,
  lang,
  practiceBenefit,
  mode,
}: Props) {
  const isCreateMode = mode === "create";
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const initialValues = useMemo<FormValues>(
    () => ({
      text_1: isCreateMode
        ? ""
        : resolveLocalizedText(practiceBenefit?.text_1, lang, ""),
      text_2: isCreateMode
        ? ""
        : resolveLocalizedText(practiceBenefit?.text_2, lang, ""),
      text_3: isCreateMode
        ? ""
        : resolveLocalizedText(practiceBenefit?.text_3, lang, ""),
      text_4: isCreateMode
        ? ""
        : resolveLocalizedText(practiceBenefit?.text_4, lang, ""),
      text_5: isCreateMode
        ? ""
        : resolveLocalizedText(practiceBenefit?.text_5, lang, ""),
      text_6: isCreateMode
        ? ""
        : resolveLocalizedText(practiceBenefit?.text_6, lang, ""),
      text_7: isCreateMode
        ? ""
        : resolveLocalizedText(practiceBenefit?.text_7, lang, ""),
      text_8: isCreateMode
        ? ""
        : resolveLocalizedText(practiceBenefit?.text_8, lang, ""),
      text_9: isCreateMode
        ? ""
        : resolveLocalizedText(practiceBenefit?.text_9, lang, ""),
      text_10: isCreateMode
        ? ""
        : resolveLocalizedText(practiceBenefit?.text_10, lang, ""),
      isActive: practiceBenefit?.isActive ?? true,
    }),
    [isCreateMode, lang, practiceBenefit]
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  useEffect(() => {
    if (!showModal) {
      return;
    }

    reset(initialValues);
    setFile(null);
    setPreviewUrl("");
  }, [initialValues, reset, showModal]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const benefitId = getPracticeBenefitId(practiceBenefit);

    const payload = {
      text_1: isCreateMode
        ? createLocalizedTextPayload(values.text_1.trim(), lang)
        : mergeLocalizedTextPayload(
            practiceBenefit?.text_1,
            values.text_1.trim(),
            lang
          ),
      isActive: Boolean(values.isActive),
      ...(values.text_2.trim()
        ? {
            text_2: isCreateMode
              ? createLocalizedTextPayload(values.text_2.trim(), lang)
              : mergeLocalizedTextPayload(
                  practiceBenefit?.text_2,
                  values.text_2.trim(),
                  lang
                ),
          }
        : {}),
      ...(values.text_3.trim()
        ? {
            text_3: isCreateMode
              ? createLocalizedTextPayload(values.text_3.trim(), lang)
              : mergeLocalizedTextPayload(
                  practiceBenefit?.text_3,
                  values.text_3.trim(),
                  lang
                ),
          }
        : {}),
      ...(values.text_4.trim()
        ? {
            text_4: isCreateMode
              ? createLocalizedTextPayload(values.text_4.trim(), lang)
              : mergeLocalizedTextPayload(
                  practiceBenefit?.text_4,
                  values.text_4.trim(),
                  lang
                ),
          }
        : {}),
      ...(values.text_5.trim()
        ? {
            text_5: isCreateMode
              ? createLocalizedTextPayload(values.text_5.trim(), lang)
              : mergeLocalizedTextPayload(
                  practiceBenefit?.text_5,
                  values.text_5.trim(),
                  lang
                ),
          }
        : {}),
      ...(values.text_6.trim()
        ? {
            text_6: isCreateMode
              ? createLocalizedTextPayload(values.text_6.trim(), lang)
              : mergeLocalizedTextPayload(
                  practiceBenefit?.text_6,
                  values.text_6.trim(),
                  lang
                ),
          }
        : {}),
      ...(values.text_7.trim()
        ? {
            text_7: isCreateMode
              ? createLocalizedTextPayload(values.text_7.trim(), lang)
              : mergeLocalizedTextPayload(
                  practiceBenefit?.text_7,
                  values.text_7.trim(),
                  lang
                ),
          }
        : {}),
      ...(values.text_8.trim()
        ? {
            text_8: isCreateMode
              ? createLocalizedTextPayload(values.text_8.trim(), lang)
              : mergeLocalizedTextPayload(
                  practiceBenefit?.text_8,
                  values.text_8.trim(),
                  lang
                ),
          }
        : {}),
      ...(values.text_9.trim()
        ? {
            text_9: isCreateMode
              ? createLocalizedTextPayload(values.text_9.trim(), lang)
              : mergeLocalizedTextPayload(
                  practiceBenefit?.text_9,
                  values.text_9.trim(),
                  lang
                ),
          }
        : {}),
      ...(values.text_10.trim()
        ? {
            text_10: isCreateMode
              ? createLocalizedTextPayload(values.text_10.trim(), lang)
              : mergeLocalizedTextPayload(
                  practiceBenefit?.text_10,
                  values.text_10.trim(),
                  lang
                ),
          }
        : {}),
      image: file,
    };

    await toast.promise(
      savePracticeBenefit({
        id: isCreateMode ? undefined : benefitId,
        locale: lang,
        ...payload,
      }),
      {
        loading: isCreateMode
          ? "Создаём benefit..."
          : "Сохраняем benefit...",
        success: isCreateMode ? "Benefit создан" : "Benefit сохранён",
        error: isCreateMode
          ? "Не удалось создать benefit"
          : "Не удалось сохранить benefit",
      }
    );

    onSaved?.();
    onClose();
  };

  const previewSource = previewUrl || practiceBenefit?.image?.url || "";

  return (
    <ModalWindow onModalClose={onClose} showModal={showModal}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex items-start gap-6">
          <div className="w-[240px] shrink-0 space-y-4">
            <div className="border border-localbrown bg-white p-3">
              <p className="mb-2 text-sm font-medium text-localbrown">
                Изображение
              </p>
              <div className="relative aspect-[3/4] overflow-hidden border border-localbrown bg-[#f5f0ed]">
                {previewSource ? (
                  <img
                    src={previewSource}
                    alt="practice benefit"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <label className="mt-3 block">
                <span className="sr-only">Загрузить изображение</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                  className="block w-full text-sm text-localbrown file:mr-4 file:border-0 file:bg-localbrown file:px-3 file:py-2 file:text-white"
                />
              </label>
            </div>

            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <label className="flex items-center gap-3 border border-localbrown bg-white px-3 py-2">
                  <input
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                    type="checkbox"
                    className="h-4 w-4 accent-localbrown"
                  />
                  <span className="text-sm text-localbrown">
                    Активный benefit
                  </span>
                </label>
              )}
            />
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {textFields.map((fieldName) => (
                <label className="block" key={fieldName}>
                  <span className="mb-2 block text-sm font-medium text-localbrown">
                    {textFieldLabels[fieldName]}
                  </span>
                  <textarea
                    {...register(fieldName)}
                    rows={fieldName === "text_1" ? 4 : 3}
                    className="w-full border border-localbrown bg-white px-4 py-3 outline-none"
                  />
                  {errors[fieldName] && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[fieldName]?.message}
                    </p>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => reset(initialValues)}
            className="h-[40px] border border-localbrown px-5 text-localbrown"
          >
            Очистить
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-[40px] border border-localbrown px-5 text-localbrown"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[40px] border border-localbrown bg-localbrown px-5 text-white disabled:opacity-60"
          >
            {isCreateMode ? "Создать benefit" : "Сохранить benefit"}
          </button>
        </div>
      </form>
    </ModalWindow>
  );
}
