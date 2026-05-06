"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { getHeroIntroId } from "@/features/content-admin/model/getHeroIntroId";
import { saveHeroIntro, type HeroIntroRecord } from "@/shared/api/client";
import { ModalWindow } from "@/shared/ui/ModalWindow/ModalWindow";

import LocalizedLanguageTabs from "./LocalizedLanguageTabs";
import LocalizedTextField from "./LocalizedTextField";

const heroIntroSchema = z.object({
  title: createLocalizedTextSchema(true, "Введите заголовок"),
  text1: createLocalizedTextSchema(true, "Введите первый текст"),
  text2: createLocalizedTextSchema(true, "Введите второй текст"),
  imageAlt: createLocalizedTextSchema(false, ""),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof heroIntroSchema>;

type Props = {
  showModal: boolean;
  onClose: () => void;
  onSaved?: () => void;
  lang: string;
  heroIntro?: HeroIntroRecord | null;
  mode: "create" | "edit";
  isHydrating?: boolean;
};

const createInitialValues = (heroIntro?: HeroIntroRecord | null): FormValues => ({
  title: normalizeLocalizedDraft(heroIntro?.title),
  text1: normalizeLocalizedDraft(heroIntro?.text1),
  text2: normalizeLocalizedDraft(heroIntro?.text2),
  imageAlt: normalizeLocalizedDraft(heroIntro?.imageAlt ?? heroIntro?.image?.alt),
  isActive: heroIntro?.isActive ?? true,
});

export default function HeroIntroEditorModal({
  showModal,
  onClose,
  onSaved,
  lang,
  heroIntro,
  mode,
  isHydrating = false,
}: Props) {
  const isCreateMode = mode === "create";
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [activeLocale, setActiveLocale] = useState<ContentAdminLocale>("ru");

  const initialValues = useMemo(() => createInitialValues(heroIntro), [heroIntro]);
  const initialValuesKey = useMemo(() => JSON.stringify(initialValues), [initialValues]);
  const lastResetKeyRef = useRef<string | null>(null);

  const methods = useForm<FormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(heroIntroSchema),
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
      lastResetKeyRef.current = null;
      return;
    }

    if (lastResetKeyRef.current !== initialValuesKey) {
      lastResetKeyRef.current = initialValuesKey;
      setActiveLocale("ru");
      reset(initialValues);
      setFile(null);
      setPreviewUrl("");
    }
  }, [initialValues, initialValuesKey, reset, showModal]);

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
    const heroId = getHeroIntroId(heroIntro);

    await toast.promise(
      saveHeroIntro({
        id: isCreateMode ? undefined : heroId,
        locale: lang,
        isActive: Boolean(values.isActive),
        title: values.title,
        text1: values.text1,
        text2: values.text2,
          imageAlt: values.imageAlt,
        image: file,
      }),
      {
        loading: isCreateMode ? "Создаём hero..." : "Сохраняем hero...",
        success: isCreateMode ? "Hero создан" : "Hero сохранён",
        error: isCreateMode ? "Не удалось создать hero" : "Не удалось сохранить hero",
      }
    );

    onSaved?.();
    onClose();
  };

  const previewSource = previewUrl || heroIntro?.image?.url || "";
  const previewAlt =
    typeof heroIntro?.imageAlt === "string"
      ? heroIntro.imageAlt
      : typeof heroIntro?.image?.alt === "string"
        ? heroIntro.image.alt
        : "hero image";

  return (
    <ModalWindow onModalClose={onClose} showModal={showModal}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {isHydrating ? (
            <p className="text-sm text-localbrown/70">Загружаем данные hero...</p>
          ) : null}

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
                    disabled={isHydrating}
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
                    disabled={isHydrating}
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
                      disabled={isHydrating}
                      className="h-4 w-4 accent-localbrown"
                    />
                    <span className="text-sm text-localbrown">Активный hero</span>
                  </label>
                )}
              />
            </div>

            <div className="flex-1 space-y-4">
              <LocalizedLanguageTabs
                activeLocale={activeLocale}
                onChange={setActiveLocale}
                disabled={isHydrating}
              />

              <LocalizedTextField<FormValues>
                key={`title-${activeLocale}`}
                name="title"
                activeLocale={activeLocale}
                label="Главный заголовок"
                required
                disabled={isHydrating}
              />

              <LocalizedTextField<FormValues>
                key={`text1-${activeLocale}`}
                name="text1"
                activeLocale={activeLocale}
                label="Первый текст"
                multiline
                rows={4}
                required
                disabled={isHydrating}
              />

              <LocalizedTextField<FormValues>
                key={`text2-${activeLocale}`}
                name="text2"
                activeLocale={activeLocale}
                label="Второй текст"
                multiline
                rows={5}
                required
                disabled={isHydrating}
              />
            </div>
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
              type="submit"
              disabled={isSubmitting || isHydrating}
              className="h-[40px] border border-localbrown bg-localbrown px-5 text-white disabled:opacity-60"
            >
              {isCreateMode ? "Создать hero" : "Сохранить hero"}
            </button>
          </div>
        </form>
      </FormProvider>
    </ModalWindow>
  );
}
