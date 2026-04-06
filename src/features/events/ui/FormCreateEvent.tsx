"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";
import { type Resolver, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { format } from "date-fns";

import { events_lib } from "@/lib/dataEvents";
import useStore from "@/store/a_store";
import { saveEvent } from "@/shared/api/client";

import DateTimePicker from "./DateTimePicker";
import ImagesUrlList from "./ImagesUrlList";
import SwitchInput from "./SwitchInput";

type FormValues = {
  timeTarget: string;
  endTimeTarget: string;
  title: string;
  description: string;
  instagramUrl: string;
};

const schema = yup.object({
  timeTarget: yup.string().trim().required("Оберіть дату і час"),
  endTimeTarget: yup.string().trim().required("Оберіть дату і час завершення"),
  title: yup.string().trim().required("Вкажіть назву події"),
  description: yup.string().trim().required("Вкажіть опис події"),
  instagramUrl: yup
    .string()
    .trim()
    .url()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue == null ? "" : value || ""
    ),
});

type FormCreateEventProps = {
  id?: string;
  timeTarget?: string;
  endTimeTarget?: string;
  title?: string;
  description?: string;
  instagramUrl?: string;
  picsArray?: { id: string; value: string; alt?: string }[];
  defaultImg?: number;
  onSaved?: () => void;
};

function buildDefaultStartIso() {
  const now = new Date();
  return `${format(now, "yyyy-MM-dd")}T12:00:00`;
}

function buildDefaultEndIso(startIso?: string) {
  const start = startIso ? new Date(startIso) : new Date(buildDefaultStartIso());
  const next = new Date(start.getTime() + 60 * 60 * 1000);
  return next.toISOString();
}

const FormCreateEvent = ({
  id,
  timeTarget: timeTarget_,
  endTimeTarget: endTimeTarget_,
  title: title_,
  description: description_,
  instagramUrl: instagramUrl_,
  picsArray: picsArray_,
  defaultImg,
  onSaved,
}: FormCreateEventProps) => {
  const { isFormEventOpen, setIsFormEventOpen } = useStore();

  const [defaultImgIndex, setDefaultImgIndex] = useState<number>(defaultImg || 0);
  const [picsArray, setPicsArray] = useState<{ id: string; value: string; alt?: string }[]>(
    picsArray_ || []
  );
  const initialStartIso = timeTarget_ || buildDefaultStartIso();
  const initialEndIso = endTimeTarget_ || buildDefaultEndIso(initialStartIso);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      timeTarget: initialStartIso,
      endTimeTarget: initialEndIso,
      title: title_ || "",
      description: description_ || "",
      instagramUrl: instagramUrl_ || "",
    },
    shouldFocusError: false,
    mode: "all",
    resolver: yupResolver(schema) as Resolver<FormValues>,
  });

  useEffect(() => {
    setDefaultImgIndex(defaultImg || 0);
    setPicsArray(picsArray_ || []);

    reset({
      timeTarget: initialStartIso,
      endTimeTarget: initialEndIso,
      title: title_ || "",
      description: description_ || "",
      instagramUrl: instagramUrl_ || "",
    });
  }, [
    defaultImg,
    description_,
    endTimeTarget_,
    instagramUrl_,
    picsArray_,
    reset,
    initialEndIso,
    initialStartIso,
    timeTarget_,
    title_,
  ]);

  const withoutIdNumbersArray = picsArray.map(({ value, alt }) => ({
    value,
    alt: alt || "",
  }));

  const resetFormState = () => {
    reset();
    setPicsArray([]);
    setDefaultImgIndex(0);
    setIsFormEventOpen(false);
    onSaved?.();
  };

  const handlerSubmit: SubmitHandler<FormValues> = async (data) => {
    const result = await saveEvent({
      id,
      title: data.title,
      timeTarget: data.timeTarget,
      endTimeTarget: data.endTimeTarget,
      description: data.description,
      instagramUrl: data.instagramUrl,
      picsArray: withoutIdNumbersArray,
      defaultImg: defaultImgIndex,
    });

    if (result) {
      resetFormState();
    }
  };

  if (!isFormEventOpen) {
    return null;
  }

  return (
    <div className="mb-[32px] flex min-h-[660px] flex-col gap-6 border border-localbrown bg-brown-light-light px-6 py-6 xl:flex-row xl:justify-between xl:px-[38px] xl:py-[30px]">
      <div id="leftSide" className="flex flex-1 flex-col gap-[24px] xl:gap-[30px]">
        <ul className="flex gap-3 overflow-x-auto border border-localbrown bg-white px-[16px] py-[10px]">
          {events_lib.map((item, index) => (
            <li
              key={index}
              className={[
                "relative flex h-[60px] w-[100px] cursor-pointer items-center justify-center overflow-hidden border bg-lilac",
                defaultImgIndex === index
                  ? "border-localbrown opacity-100"
                  : "border-white opacity-40",
              ].join(" ")}
              onClick={() => setDefaultImgIndex(index)}
            >
              <Image
                src={item.value}
                alt={item.alt}
                width={100}
                height={60}
                sizes="(max-width: 768px) 15vw, (max-width: 1280px) 10vw, 5vw"
                className="h-full w-full object-cover object-center"
              />
            </li>
          ))}
        </ul>

        <ImagesUrlList
          picsArray={picsArray}
          setPicsArray={setPicsArray}
          className="flex-[1] overflow-y-auto border border-localbrown bg-white p-[16px]"
        />

        <SwitchInput
          picsArray={picsArray}
          setPicsArray={setPicsArray}
          className="border border-localbrown"
        />
      </div>

      <form
        id="rightSide"
        onSubmit={handleSubmit(handlerSubmit)}
        className="relative flex h-full w-full flex-col gap-4 xl:w-[591px]"
      >
        <DateTimePicker
          fieldName="timeTarget"
          label="Обрати дату і час початку"
          register={register}
          setValue={setValue}
          errors={errors.timeTarget}
          defaultValue={timeTarget_}
        />

        <DateTimePicker
          fieldName="endTimeTarget"
          label="Обрати дату і час завершення"
          register={register}
          setValue={setValue}
          errors={errors.endTimeTarget}
          defaultValue={endTimeTarget_}
        />

        <label className="flex w-full flex-col gap-2">
          <p className="text-localbrown">Найменування події</p>
          <input
            {...register("title")}
            onChange={(e) =>
              setValue("title", e.target.value, { shouldValidate: true })
            }
            placeholder="Майстер-клас ..."
            className={[
              "h-[40px] border px-[16px] outline-none",
              errors.title ? "border-red-600" : "border-localbrown",
            ].join(" ")}
            type="text"
          />
        </label>

        <label className="flex w-full flex-col gap-2">
          <p className="text-localbrown">Посилання на Instagram</p>
          <input
            {...register("instagramUrl")}
            onChange={(e) =>
              setValue("instagramUrl", e.target.value, { shouldValidate: true })
            }
            placeholder="https://instagram.com/..."
            className="h-[40px] border border-localbrown px-[16px] outline-none"
            type="url"
          />
          {errors.instagramUrl && (
            <span className="text-sm text-red-600">
              Вкажіть коректне посилання або залиште поле порожнім
            </span>
          )}
        </label>

        <label className="flex flex-1 flex-col gap-2">
          <p className="text-localbrown">Опис події</p>
          <textarea
            {...register("description")}
            onChange={(e) =>
              setValue("description", e.target.value, {
                shouldValidate: true,
              })
            }
            placeholder="Оголошую про..."
            rows={10}
            className={[
              "min-h-[280px] w-full resize-none border p-[16px] outline-none xl:min-h-[360px]",
              errors.description ? "border-red-600" : "border-localbrown",
            ].join(" ")}
          />
        </label>

        <button
          type="submit"
          className="mt-auto h-[40px] w-full border border-localbrown xl:absolute xl:bottom-0 xl:right-0 xl:w-[207px]"
        >
          Опублікувати
        </button>
      </form>
    </div>
  );
};

export default FormCreateEvent;
