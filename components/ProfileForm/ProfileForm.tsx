"use client";

import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import ChevronDown from "../0_ui/ChevronDown";
import useStore from "@/store/a_store";
import toast from "react-hot-toast";

type FormValues = {
  nickname: string;
  phone: string;
  isSubscribed: boolean;
};

const schema = yup.object({
  nickname: yup
    .string()
    .trim()
    .transform((originalValue) => {
      return originalValue === "" ? undefined : originalValue;
    })
    .min(2, "Мінімум 2 символи")
    .max(50, "Максимум 50 символів"),

  phone: yup
    .string()
    .trim()
    .transform((originalValue) => {
      return originalValue === "" ? undefined : originalValue;
    })
    .matches(RegExp("^\\+.*$"), "Має починатися з +")
    .min(12, "Мін 11 цифр")
    .matches(RegExp("^\\+\\d*$"), "Приймає лише цифри")
    .max(13, "Макс 12 цифр"),

  isSubscribed: yup.boolean().oneOf([true, false]),
});

const ProfileForm = () => {
  const session = useSession();
  const router = useRouter();

  const { user, setUser } = useStore();

  const [portrait, setPortrait] = useState<string>("");
  const [file, setFile] = useState<any>(null);

  const filePicker: React.LegacyRef<HTMLInputElement> | undefined =
    useRef(null);

  console.log(88, user);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  }, [session.status]);

  useEffect(() => {
    const changerFormatFile = () => {
      const reader = new FileReader();
      if (file !== null) {
        reader?.readAsDataURL(file);
        reader.onload = () => {
          setPortrait(reader.result as string);
        };
      }
    };

    if (file) {
      changerFormatFile();
    }
  }, [file]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      nickname: user?.nickname === "" ? user?.nickname : user?.nickname,
      phone: user?.phone,
      isSubscribed: user?.isSubscribed,
    },
    shouldFocusError: false,
    mode: "all",
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    setValue("nickname", user?.nickname === "" ? user?.name : user?.nickname);
    setValue("phone", user?.phone);
    setValue("isSubscribed", user?.isSubscribed);
  }, [user?.nickname, user?.phone, user?.isSubscribed]);

  const imageChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const files = e.target.files || null;
    files && files.length > 0 && setFile(files[0]);
  };

  const handlerSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = new FormData();

    formData.append(
      "nickname",
      data.nickname === undefined ? "" : data.nickname
    );

    formData.append("phone", data.phone === undefined ? "" : data.phone);

    formData.append("isSubscribed", data.isSubscribed as any);

    reset();

    if (file) {
      formData.append("isFileExists", true as any);
      formData.append("file", file);
      setFile(null);
      setPortrait("");
    }

    const userPatchPromise = new Promise(async (resolve: any, reject) => {
      const result = await fetch("/api/user", {
        method: "PATCH",
        body: formData,
      });

      if (result.ok) {
        const userInfo = await result.json();
        setUser(userInfo);
        resolve();
      } else reject();
    });

    await toast.promise(
      userPatchPromise,
      {
        loading: "Триває збереження...",
        success: "Успішно збережено",
        error: "Помилка збереження",
      },
      {
        success: {
          duration: 2500,
        },
        error: {
          duration: 4000,
        },
      }
    );
  };

  return (
    user && (
      <>
        <div className="flex items-center pb-[30px] border-b-[1px] border-lilac">
          <p className="w-[323px] text-cadetblue">Фото профілю</p>
          <div
            id="thumb"
            className="relative border-[1px] w-[70px] h-[70px] rounded-full overflow-hidden"
          >
            {(portrait || user.portrait || user.image) && (
              <Image
                src={portrait || user.portrait || user.image}
                alt="User portrait"
                width={70}
                height={70}
                className="h-full w-full object-cover object-center"
              />
            )}
          </div>
          <button
            type="button"
            className="flex w-[40px] h-[40px] ml-auto justify-center items-center "
            onClick={() => {
              filePicker.current?.click();
            }}
          >
            <ChevronDown className=" w-[20px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handlerSubmit)} className="">
          <label className="flex items-center h-[73px] border-b-[1px] border-lilac">
            <span className="w-[323px] text-cadetblue">{"Ім'я"}</span>
            <input
              {...register("nickname")}
              onChange={(e) =>
                setValue("nickname", e.target.value, { shouldValidate: true })
              }
              className=" w-[300px] px-[4px]"
              type="text"
              placeholder="Name"
            />
            {errors.nickname && (
              <p className=" ml-[8px] text-red-600">
                {errors.nickname.message}
              </p>
            )}
          </label>

          <label className="flex items-center h-[73px] border-b-[1px] border-lilac">
            <span className="w-[323px] text-cadetblue">Телефон</span>
            <input
              {...register("phone")}
              onChange={(e) =>
                setValue("phone", e.target.value, { shouldValidate: true })
              }
              className=" w-[300px] px-[4px]"
              type="text"
              placeholder="+380991234567"
            />
            {errors.phone && (
              <p className=" ml-[8px] text-red-600">{errors.phone.message}</p>
            )}
          </label>

          <label className="flex items-center h-[73px] border-b-[1px] border-lilac">
            <span className="w-[323px] text-cadetblue">Електронна пошта</span>
            <input
              className=" appearance-none text-gray-900 "
              type="text"
              placeholder={user.email}
              disabled={true}
            />
          </label>

          <label className="cursor-pointer flex items-center h-[73px] border-b-[1px] border-lilac ">
            <span className="w-[323px] text-cadetblue">
              Отримувати повідомлення
            </span>

            <Controller
              name="isSubscribed"
              control={control}
              defaultValue={false}
              render={({
                field,
              }: {
                field: { value: boolean; onChange: Function };
              }) => (
                <input
                  onChange={(e) =>
                    field.onChange(e.target.checked, { shouldValidate: true })
                  }
                  type="checkbox"
                  checked={String(field.value) === "true" ? true : false}
                  className=" cursor-pointer "
                />
              )}
            />
          </label>

          {/*Fileinput is hidden */}
          <input
            name="file"
            className="hidden"
            ref={filePicker}
            type="file"
            onChange={imageChangeHandler}
            accept="image/*"
          />

          <button
            type="submit"
            className="block w-[92px] h-[30px] mx-auto mt-[20px] rounded-[10px] border-[1px] border-localbrown text-localbrown"
          >
            Зберегти
          </button>
        </form>
      </>
    )
  );
};

export default ProfileForm;
