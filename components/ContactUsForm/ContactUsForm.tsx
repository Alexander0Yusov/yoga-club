"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  comment: string;
  agreement: boolean;
};

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Обов'язкове для заповнення")
    .min(2, "Мін 2 символів")
    .max(50, "Максимум 50 символів")
    .matches(RegExp("^[\\d\\D]*$"), "Особливе правило"),

  email: yup.string().trim().notRequired().email("Поле має бути валідним"),

  phone: yup
    .string()
    .trim()
    .required("Обов'язкове для заповнення")
    .matches(RegExp("^\\+.*$"), "Має починатися з +")
    .min(12, "Мін 11 цифр")
    .matches(RegExp("^\\+\\d*$"), "Приймає лише цифри")
    .max(13, "Макс 12 цифр"),

  comment: yup
    .string()
    .trim()
    .transform((originalValue) => {
      return originalValue === "" ? undefined : originalValue;
    })
    .min(5, "Мін 5 символів")
    .max(32, "Макс 32 символів"),

  agreement: yup.boolean().oneOf([true]).required(),
});

const ContactUsForm = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    shouldFocusError: false,
    mode: "all",
    resolver: yupResolver(schema) as any,
  });

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    const sandingPromise = new Promise(async (resolve: any, reject) => {
      const result = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result.ok) {
        resolve();
        reset();
      } else reject();
    });

    await toast.promise(
      sandingPromise,
      {
        loading: "Триває відправлення...",
        success: "Успішно відправлено",
        error: "Помилка відправлення",
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
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="border-[1px] border-orange-700"
    >
      <div className=" flex w-full justify-between">
        <div className=" w-[683px]">
          <label className=" relative block mb-[12px] text-fs16 border-[1px] border-orange-700">
            Ім’я*
            <input
              {...register("name")}
              onChange={(e) =>
                setValue("name", e.target.value, { shouldValidate: true })
              }
              className="w-full h-[60px] px-[8px] mt-[8px] rounded-[10px] border-[1px] border-lilac"
              type="text"
              placeholder="Іван Іванов"
            />
            {errors.name && (
              <p className=" absolute top-0 right-0 text-red-600">
                {errors.name.message}
              </p>
            )}
          </label>

          <label className=" relative block mb-[12px] text-fs16 border-[1px] border-orange-700">
            Електронна пошта
            <input
              {...register("email")}
              onChange={(e) =>
                setValue("email", e.target.value, { shouldValidate: true })
              }
              className="w-full h-[60px] px-[8px] mt-[8px] rounded-[10px] border-[1px] border-lilac"
              type="email"
              placeholder="abcd@efgh.mail"
            />
            {errors.email && (
              <p className=" absolute top-0 right-0 text-red-600">
                {errors.email.message}
              </p>
            )}
          </label>

          <label className=" relative block text-fs16 border-[1px] border-orange-700">
            Телефон*
            <input
              {...register("phone")}
              onChange={(e) =>
                setValue("phone", e.target.value, { shouldValidate: true })
              }
              className="w-full h-[60px] px-[8px] mt-[8px] rounded-[10px] border-[1px] border-lilac"
              type="text"
              placeholder="+380991234567"
            />
            {errors.phone && (
              <p className=" absolute top-0 right-0 text-red-600">
                {errors.phone.message}
              </p>
            )}
          </label>
        </div>

        <div className="flex flex-col justify-between w-[683px] ">
          <label className=" relative">
            Коментар
            <textarea
              {...register("comment")}
              onChange={(e) =>
                setValue("comment", e.target.value, { shouldValidate: true })
              }
              className=" w-full h-[208px] p-[8px] mt-[4px] resize-none rounded-[10px] border-[1px] border-lilac caret-black "
            />
            {errors.comment && (
              <p className=" absolute top-0 right-0 text-red-600">
                {errors.comment.message}
              </p>
            )}
          </label>

          <label className="cursor-pointer flex flex-row-reverse justify-end ">
            <span className=" text-fs16">
              Згода на обробку персональних даних
            </span>

            <Controller
              name="agreement"
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
                  checked={field.value}
                  className=" mr-[8px] "
                />
              )}
            />
          </label>
        </div>
      </div>

      <div className="flex mt-[32px] items-end">
        <p>* Поля обов'язкові для заповнення</p>
        <button
          disabled={!isValid}
          className="block w-[250px] h-[50px] ml-auto disabled:text-gray-500 bg-brown-light disabled:bg-brown-light-light border-[2px] border-localbrown disabled:border-brown-light  rounded-full "
          type="submit"
        >
          Відправити заявку
        </button>
      </div>
    </form>
  );
};

export default ContactUsForm;
