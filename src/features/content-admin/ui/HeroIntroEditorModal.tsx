"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import type { HeroIntroRecord } from "@/shared/api/client";
import { saveHeroIntro } from "@/shared/api/client";
import { ModalWindow } from "@/shared/ui/ModalWindow/ModalWindow";
import { getHeroIntroId } from "@/features/content-admin/model/getHeroIntroId";

const schema = z.object({
  title: z.string().trim().min(1, "Введите заголовок"),
  text1: z.string().trim().min(1, "Введите первый текст"),
  text2: z.string().trim().min(1, "Введите второй текст"),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  showModal: boolean;
  onClose: () => void;
  onSaved?: () => void;
  lang: string;
  heroIntro?: HeroIntroRecord | null;
  mode: "create" | "edit";
};

export default function HeroIntroEditorModal({
  showModal,
  onClose,
  onSaved,
  lang,
  heroIntro,
  mode,
}: Props) {
  const isCreateMode = mode === "create";
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const initialValues = useMemo<FormValues>(
    () => ({
      title: isCreateMode ? "" : (typeof heroIntro?.title === "string" ? heroIntro.title : ""),
      text1: isCreateMode ? "" : (typeof heroIntro?.text1 === "string" ? heroIntro.text1 : ""),
      text2: isCreateMode ? "" : (typeof heroIntro?.text2 === "string" ? heroIntro.text2 : ""),
      isActive: heroIntro?.isActive ?? true,
    }),
    [heroIntro, isCreateMode]
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
    const heroId = getHeroIntroId(heroIntro);

    await toast.promise(
      saveHeroIntro({
        id: isCreateMode ? undefined : heroId,
        locale: lang,
        isActive: Boolean(values.isActive),
        title: { ru: values.title },
        text1: { ru: values.text1 },
        text2: { ru: values.text2 },
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

  return (
    <ModalWindow onModalClose={onClose} showModal={showModal}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex items-start gap-6">
          <div className="w-[240px] shrink-0 space-y-4">
            <div className="border border-localbrown bg-white p-3">
              <p className="mb-2 text-sm font-medium text-localbrown">Изображение</p>
              <div className="relative aspect-[3/4] overflow-hidden border border-localbrown bg-[#f5f0ed]">
                {previewSource ? (
                  <img
                    src={previewSource}
                    alt={typeof heroIntro?.image?.alt === "string" ? heroIntro.image.alt : "hero image"}
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
                  <span className="text-sm text-localbrown">Активный hero</span>
                </label>
              )}
            />
          </div>

          <div className="flex-1 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-localbrown">
                Главный заголовок
              </span>
              <input
                {...register("title")}
                className="h-[44px] w-full border border-localbrown bg-white px-4 outline-none"
                type="text"
                autoComplete="off"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-localbrown">
                Первый текст
              </span>
              <textarea
                {...register("text1")}
                rows={4}
                className="w-full border border-localbrown bg-white px-4 py-3 outline-none"
              />
              {errors.text1 && (
                <p className="mt-1 text-xs text-red-600">{errors.text1.message}</p>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-localbrown">
                Второй текст
              </span>
              <textarea
                {...register("text2")}
                rows={5}
                className="w-full border border-localbrown bg-white px-4 py-3 outline-none"
              />
              {errors.text2 && (
                <p className="mt-1 text-xs text-red-600">{errors.text2.message}</p>
              )}
            </label>
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
            disabled={isSubmitting}
            className="h-[40px] border border-localbrown bg-localbrown px-5 text-white disabled:opacity-60"
          >
            {isCreateMode ? "Создать hero" : "Сохранить hero"}
          </button>
        </div>
      </form>
    </ModalWindow>
  );
}
