"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  createLocalizedTextSchema,
  normalizeLocalizedDraft,
  type ContentAdminLocale,
} from "@/features/content-admin/model/localizedTextForm";
import { getPracticeBenefitId } from "@/features/content-admin/model/getPracticeBenefitId";
import {
  savePracticeBenefit,
  type PracticeBenefitRecord,
} from "@/shared/api/client";
import { ModalWindow } from "@/shared/ui/ModalWindow/ModalWindow";

import LocalizedLanguageTabs from "./LocalizedLanguageTabs";
import LocalizedTextField from "./LocalizedTextField";

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

const practiceBenefitSchema = z.object({
  text_1: createLocalizedTextSchema(true, "Введите первый текст"),
  text_2: createLocalizedTextSchema(false, ""),
  text_3: createLocalizedTextSchema(false, ""),
  text_4: createLocalizedTextSchema(false, ""),
  text_5: createLocalizedTextSchema(false, ""),
  text_6: createLocalizedTextSchema(false, ""),
  text_7: createLocalizedTextSchema(false, ""),
  text_8: createLocalizedTextSchema(false, ""),
  text_9: createLocalizedTextSchema(false, ""),
  text_10: createLocalizedTextSchema(false, ""),
  imageAlt: createLocalizedTextSchema(false, ""),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof practiceBenefitSchema>;

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

const createInitialValues = (
  practiceBenefit?: PracticeBenefitRecord | null
): FormValues => ({
  text_1: normalizeLocalizedDraft(practiceBenefit?.text_1),
  text_2: normalizeLocalizedDraft(practiceBenefit?.text_2),
  text_3: normalizeLocalizedDraft(practiceBenefit?.text_3),
  text_4: normalizeLocalizedDraft(practiceBenefit?.text_4),
  text_5: normalizeLocalizedDraft(practiceBenefit?.text_5),
  text_6: normalizeLocalizedDraft(practiceBenefit?.text_6),
  text_7: normalizeLocalizedDraft(practiceBenefit?.text_7),
  text_8: normalizeLocalizedDraft(practiceBenefit?.text_8),
  text_9: normalizeLocalizedDraft(practiceBenefit?.text_9),
  text_10: normalizeLocalizedDraft(practiceBenefit?.text_10),
  imageAlt: normalizeLocalizedDraft(practiceBenefit?.image?.alt),
  isActive: practiceBenefit?.isActive ?? true,
});

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
  const [activeLocale, setActiveLocale] = useState<ContentAdminLocale>("ru");

  const initialValues = useMemo(
    () => createInitialValues(practiceBenefit),
    [practiceBenefit]
  );

  const methods = useForm<FormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(practiceBenefitSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!showModal) {
      return;
    }

    setActiveLocale("ru");
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

    await toast.promise(
      savePracticeBenefit({
        id: isCreateMode ? undefined : benefitId,
        locale: lang,
        isActive: Boolean(values.isActive),
        text_1: values.text_1,
        text_2: values.text_2,
        text_3: values.text_3,
        text_4: values.text_4,
        text_5: values.text_5,
        text_6: values.text_6,
        text_7: values.text_7,
        text_8: values.text_8,
        text_9: values.text_9,
        text_10: values.text_10,
        imageAlt: values.imageAlt,
        image: file,
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
  const previewAlt =
    typeof practiceBenefit?.image?.alt === "string"
      ? practiceBenefit.image.alt
      : "practice benefit";

  return (
    <ModalWindow onModalClose={onClose} showModal={showModal}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex items-start gap-6">
            <div className="w-[240px] shrink-0 space-y-4">
              <div className="border border-localbrown bg-white p-3">
                <p className="mb-2 text-sm font-medium text-localbrown">Изображение</p>
                <div className="relative aspect-[3/4] overflow-hidden border border-localbrown bg-[#f5f0ed]">
                  {previewSource ? (
                    <img
                      src={previewSource}
                      alt={previewAlt}
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

                <div className="mt-4">
                  <LocalizedTextField<FormValues>
                    key={`imageAlt-${activeLocale}`}
                    name="imageAlt"
                    activeLocale={activeLocale}
                    label="Alt изображения"
                    placeholder="Описание изображения"
                  />
                </div>
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
                    <span className="text-sm text-localbrown">Активный benefit</span>
                  </label>
                )}
              />
            </div>

            <div className="flex-1 space-y-4">
              <LocalizedLanguageTabs
                activeLocale={activeLocale}
                onChange={setActiveLocale}
              />

              <div className="grid gap-4 md:grid-cols-2">
                {textFields.map((fieldName) => (
                  <LocalizedTextField<FormValues>
                    key={fieldName}
                    name={fieldName}
                    activeLocale={activeLocale}
                    label={textFieldLabels[fieldName]}
                    multiline
                    rows={fieldName === "text_1" ? 4 : 3}
                    required={fieldName === "text_1"}
                  />
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
      </FormProvider>
    </ModalWindow>
  );
}
