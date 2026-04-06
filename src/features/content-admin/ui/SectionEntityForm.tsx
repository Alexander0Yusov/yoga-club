"use client";

import { useEffect } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  sectionContentTypeSchema,
  type SectionContentType,
} from "@/modules/sections/contracts/section.contract";
import { ModalWindow } from "@/shared/ui/ModalWindow/ModalWindow";

const sectionForOptions = sectionContentTypeSchema.options;

export const sectionEntitySchema = z.object({
  title: z.string().trim().min(1, "Введите заголовок"),
  subtitle_1: z.string().trim(),
  subtitle_2: z.string().trim(),
  for: z.string().trim().min(1, "Выберите тип секции"),
  orderIndex: z.coerce.number().int().min(0, "Введите порядковый индекс"),
  isActive: z.boolean(),
});

export type SectionEntityFormValues = z.infer<typeof sectionEntitySchema>;

type Props = {
  showModal: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<SectionEntityFormValues>;
  title: string;
  description: string;
  submitLabel: string;
  initialValues: SectionEntityFormValues;
};

const sectionForLabels: Record<SectionContentType, string> = {
  reviews: "Отзывы",
  videos: "Видео",
  advantages: "Преимущества",
  practice_benefits: "Польза практики",
  club_events: "События клуба",
  about_me_cards: "Карточки обо мне",
  hero_intro: "Hero Intro",
  yoga_directions: "Направления йоги",
  bookings: "Бронирования",
  event_refs_panel: "Панель ссылок на события",
};

export default function SectionEntityForm({
  showModal,
  onClose,
  onSubmit,
  title,
  description,
  submitLabel,
  initialValues,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SectionEntityFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(sectionEntitySchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (!showModal) {
      return;
    }

    reset(initialValues);
  }, [initialValues, reset, showModal]);

  return (
    <ModalWindow onModalClose={onClose} showModal={showModal}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.18em] text-localbrown">
            {title}
          </p>
          <p className="text-sm text-localbrown/80">{description}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-localbrown">
                Заголовок
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
                Подзаголовок 1
              </span>
              <textarea
                {...register("subtitle_1")}
                rows={4}
                className="w-full border border-localbrown bg-white px-4 py-3 outline-none"
              />
              {errors.subtitle_1 && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.subtitle_1.message}
                </p>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-localbrown">
                Подзаголовок 2
              </span>
              <textarea
                {...register("subtitle_2")}
                rows={5}
                className="w-full border border-localbrown bg-white px-4 py-3 outline-none"
              />
              {errors.subtitle_2 && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.subtitle_2.message}
                </p>
              )}
            </label>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-localbrown">
                Тип секции
              </span>
              <select
                {...register("for")}
                className="h-[44px] w-full border border-localbrown bg-white px-4 outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Выберите тип секции
                </option>
                {sectionForOptions.map((option) => (
                  <option key={option} value={option}>
                    {sectionForLabels[option as SectionContentType]}
                  </option>
                ))}
              </select>
              {errors.for && (
                <p className="mt-1 text-xs text-red-600">{errors.for.message}</p>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-localbrown">
                Порядок на главной
              </span>
              <input
                {...register("orderIndex")}
                type="number"
                className="h-[44px] w-full border border-localbrown bg-white px-4 outline-none"
              />
              {errors.orderIndex && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.orderIndex.message}
                </p>
              )}
            </label>

            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <label className="flex items-center gap-3 border border-localbrown bg-white px-4 py-3">
                  <input
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                    type="checkbox"
                    className="h-4 w-4 accent-localbrown"
                  />
                  <span className="text-sm text-localbrown">Активная секция</span>
                </label>
              )}
            />
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
            {submitLabel}
          </button>
        </div>
      </form>
    </ModalWindow>
  );
}
