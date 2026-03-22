"use client";

import React, { useState } from "react";
import Image from "next/image";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import DateTimePicker from "./DateTimePicker";
import ImagesUrlList from "./ImagesUrlList";
import SwitchInput from "./SwitchInput";
import { events_lib } from "@/lib/dataEvents";
import useStore from "@/store/a_store";
import { saveEvent } from "@/shared/api/client";
import ChevronDown from "@/shared/ui/ChevronDown";

type FormValues = {
  timeTarget: string;
  title: string;
  description: string;
};

const schema = yup.object({
  timeTarget: yup
    .string()
    .trim()
    .required()
    .matches(RegExp("^(20\\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$")),
  title: yup.string().trim().required(),
  description: yup.string().trim().required(),
});

const FormCreateEvent = ({
  id,
  timeTarget: timeTarget_,
  title: title_,
  description: description_,
  picsArray: picsArray_,
  defaultImg,
}: {
  id?: string;
  timeTarget?: string;
  title?: string;
  description?: string;
  picsArray?: { id: string; value: string }[];
  defaultImg?: number;
}) => {
  const { isFormEventOpen, setIsFormEventOpen } = useStore();

  const [defaultImgIndex, setDefaultImgIndex] = useState<number>(
    defaultImg || 0,
  );
  const [picsArray, setPicsArray] = useState<{ id: string; value: string }[]>(
    picsArray_ || [],
  );

  const resetInputs = () => {
    setPicsArray([]);
  };

  const withoutIdNumbersArray = picsArray?.map(({ value }) => ({ value }));

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      timeTarget: timeTarget_,
      title: title_,
      description: description_,
    },
    shouldFocusError: false,
    mode: "all",
    resolver: yupResolver(schema),
  });

  const handlerSubmit: SubmitHandler<FormValues> = async (data) => {
    const result = await saveEvent({
      id,
      title: data.title,
      timeTarget: data.timeTarget,
      description: data.description,
      picsArray: withoutIdNumbersArray,
      defaultImg: defaultImgIndex,
    });

    if (result) {
      reset();
      resetInputs();
      setIsFormEventOpen(false);
      window.location.reload();
    }
  };

  return (
    isFormEventOpen && (
      <div className="mb-[32px] flex h-[660px] justify-between rounded-[10px] border-[1px] border-localbrown bg-brown-light-light px-[38px] py-[30px]">
        <div id="leftSide" className="flex flex-col gap-[30px]">
          <ul className="flex justify-between rounded-[10px] border-[1px] border-localbrown bg-white px-[16px] py-[4px]">
            {events_lib.map((item, index) => (
              <li
                key={index}
                className={
                  "relative flex h-[60px] w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-[5px] border-[1px] bg-lilac " +
                  `${
                    defaultImgIndex === index
                      ? "border-localbrown opacity-1"
                      : "border-white opacity-40"
                  }`
                }
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
            className="w-[685px] flex-[1] overflow-y-auto rounded-[10px] border-[1px] border-localbrown bg-white p-[16px]"
          />

          <SwitchInput
            picsArray={picsArray}
            setPicsArray={setPicsArray}
            className="h-[70px] rounded-[10px] border-[1px] border-localbrown"
          />
        </div>

        <form
          id="rightSide"
          onSubmit={handleSubmit(handlerSubmit)}
          className="relative h-full w-[591px] border-[1px] border-orange-950"
        >
          <label className="mb-[4px] flex w-full flex-col border-[1px] border-orange-950">
            <p className="text-localbrown">Обрати дату</p>

            <DateTimePicker
              register={register}
              setValue={setValue}
              errors={errors?.timeTarget}
            />
          </label>

          <label className="mb-[4px] flex w-full flex-col border-[1px] border-orange-950">
            <p className="text-localbrown">Найменування події</p>
            <input
              {...register("title")}
              onChange={(e) =>
                setValue("title", e.target.value, { shouldValidate: true })
              }
              placeholder="Майстер-клас зі..."
              className={
                "h-[40px] rounded-[10px] border-[1px] px-[16px] " +
                `${errors.title ? "border-red-600" : "border-localbrown"}`
              }
              type="text"
            />
          </label>

          <label className="flex flex-col border-[1px] border-orange-950">
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
              cols={50}
              className={
                "h-[360px] w-full resize-none rounded-[10px] border-[1px] border-localbrown p-[16px] " +
                `${errors.description ? "border-red-600" : "border-localbrown"}`
              }
            />
          </label>

          <button
            type="submit"
            className="absolute bottom-0 right-0 block h-[40px] w-[207px] rounded-[10px] border-[1px] border-localbrown"
          >
            Опублікувати
          </button>
        </form>
      </div>
    )
  );
};

export default FormCreateEvent;
