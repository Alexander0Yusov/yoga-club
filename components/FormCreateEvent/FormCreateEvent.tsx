"use client";

import React, { useState } from "react";
import ChevronDown from "../0_ui/ChevronDown";

import DateTimePicker from "../DateTimePicker/DateTimePicker";

import ImagesUrlList from "../ImagesUrlList/ImagesUrlList";
import SwitchInput from "../SwitchInput/SwitchInput";
import { events_lib } from "@/lib/dataEvents";
import Image from "next/image";

import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useStore from "@/store/a_store";

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
  const { isFormEventOpen } = useStore();

  const [defaultImgIndex, setDefaultImgIndex] = useState<number>(
    defaultImg || 0
  );
  const [picsArray, setPicsArray] = useState<{ id: string; value: string }[]>(
    picsArray_ || []
  );

  const resetInputs: any = () => {
    setPicsArray([]);
  };

  const withoutIdNumbersArray: any = picsArray?.map(({ value }) => ({ value }));

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
    resolver: yupResolver(schema) as any,
  });

  const handlerSubmit: SubmitHandler<FormValues> = async (data) => {
    if (id) {
      const res = await patchEvent(data);
      console.log("tt", res);

      if (res.ok) {
        reset();
        resetInputs();

        const r = await res.json();
        console.log("result patch ev ", r);
      }
    }

    if (!id) {
      const res = await postEvent(data);

      if (res.ok) {
        reset();
        resetInputs();

        const r = await res.json();
        console.log("result post ev ", r);
      }
    }
  };

  async function postEvent(data: any) {
    const result = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        timeTarget: data.timeTarget,
        description: data.description,
        picsArray: withoutIdNumbersArray,
        defaultImg: defaultImgIndex,
      }),
    });

    return result;
  }

  async function patchEvent(data: any) {
    const result = await fetch("/api/event", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title: data.title,
        timeTarget: data.timeTarget,
        description: data.description,
        picsArray: withoutIdNumbersArray,
        defaultImg: defaultImgIndex,
      }),
    });
    return result;
  }

  return (
    isFormEventOpen && (
      <div className="flex justify-between h-[660px] px-[38px] py-[30px] mb-[32px] bg-brown-light-light border-[1px] border-localbrown rounded-[10px]">
        <div id="leftSide" className="flex flex-col gap-[30px]">
          <ul className="flex justify-between px-[16px] py-[4px] bg-white border-[1px] border-localbrown rounded-[10px]">
            {events_lib.map((item, index) => (
              <li
                key={index}
                className={
                  " relative flex justify-center items-center w-[100px] h-[60px] cursor-pointer bg-lilac rounded-[5px] overflow-hidden border-[1px] " +
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
            className="flex-[1] w-[685px] p-[16px] overflow-y-auto bg-white border-[1px] border-localbrown rounded-[10px]"
          />

          <SwitchInput
            picsArray={picsArray}
            setPicsArray={setPicsArray}
            className="h-[70px] border-[1px] border-localbrown rounded-[10px]"
          />
        </div>

        <form
          id="rightSide"
          onSubmit={handleSubmit(handlerSubmit)}
          className=" relative w-[591px] h-full border-[1px] border-orange-950 "
        >
          <label className="flex flex-col w-full mb-[4px] border-[1px] border-orange-950">
            <p className=" text-localbrown">Обрати дату</p>

            <DateTimePicker
              register={register}
              setValue={setValue}
              errors={errors?.timeTarget}
            />
          </label>

          <label className="flex flex-col w-full mb-[4px] border-[1px] border-orange-950">
            <p className=" text-localbrown">Найменування події</p>
            <input
              {...register("title")}
              onChange={(e) =>
                setValue("title", e.target.value, { shouldValidate: true })
              }
              placeholder="Майстер-клас зі..."
              className={
                " h-[40px] px-[16px] border-[1px] rounded-[10px] " +
                `${errors.title ? "border-red-600" : "border-localbrown"}`
              }
              type="text"
            />
          </label>

          <label className=" flex flex-col border-[1px] border-orange-950">
            <p className=" text-localbrown">Опис події</p>
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
                "resize-none w-full h-[360px] p-[16px] border-[1px] border-localbrown rounded-[10px] " +
                `${errors.description ? "border-red-600" : "border-localbrown"}`
              }
            />
          </label>

          <button
            type="submit"
            className=" absolute bottom-0 right-0 block w-[207px] h-[40px] border-[1px] border-localbrown rounded-[10px]"
          >
            Опублікувати
          </button>
        </form>
      </div>
    )
  );
};

export default FormCreateEvent;
