"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import type { LocaleT } from "@/i18nConfig";
import * as m from "@/paraglide/messages";
import { sendTelegramContactForm } from "@/shared/api/client";
import Container from "@/shared/ui/Container/Container";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  comment: string;
  agreement: boolean;
};

type ContactSectionProps = {
  lang: LocaleT;
  category: string;
  subtitle: string;
  title: string;
};

function createSchema(messages: ReturnType<typeof m.getMessages>) {
  return yup.object({
    name: yup
      .string()
      .trim()
      .required(messages.error_required())
      .min(2, messages.error_min_length())
      .max(50, messages.error_max_length()),
    email: yup
      .string()
      .trim()
      .notRequired()
      .email(messages.error_invalid_email()),
    phone: yup
      .string()
      .trim()
      .required(messages.error_required())
      .matches(/^\+.*$/, messages.error_phone_must_start_plus())
      .min(12, messages.error_min_length())
      .matches(/^\+\d*$/, messages.error_digits_only())
      .max(13, messages.error_max_length()),
    comment: yup
      .string()
      .trim()
      .transform((value) => (value === "" ? undefined : value))
      .min(5, messages.error_min_length())
      .max(32, messages.error_max_length()),
    agreement: yup.boolean().oneOf([true]).required(messages.error_required()),
  });
}

export default function ContactSection({
  lang,
  category,
  subtitle,
  title,
}: ContactSectionProps) {
  const messages = m.getMessages(lang);
  const schema = createSchema(messages);

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
    const sendingPromise = sendTelegramContactForm({
      payload: data,
      locale: lang,
    }).then(() => {
      reset();
    });

    await toast.promise(
      sendingPromise,
      {
        loading: "Надсилаємо заявку...",
        success: "Заявку успішно надіслано",
        error: "Не вдалося надіслати заявку",
      },
      {
        success: { duration: 2500 },
        error: { duration: 4000 },
      },
    );
  };

  return (
    <section id="contactus" className="py-10 md:py-14">
      <Container className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-[#497274]">
            {category}
          </p>
          <h2 className="font-philosopher text-[38px] font-bold leading-none text-localbrown md:text-[54px]">
            {title}
          </h2>
          <p className="text-[16px] leading-[1.4] text-[#2c2c2c]">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <label className="block text-[16px] text-[#2c2c2c]">
                {messages.form_name()}*
                <input
                  {...register("name")}
                  onChange={(e) =>
                    setValue("name", e.target.value, { shouldValidate: true })
                  }
                  className="mt-2 h-[60px] w-full border border-lilac bg-white px-3 text-[#2c2c2c] outline-none"
                  type="text"
                  placeholder={messages.form_name_placeholder()}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </label>

              <label className="block text-[16px] text-[#2c2c2c]">
                {messages.form_email()}
                <input
                  {...register("email")}
                  onChange={(e) =>
                    setValue("email", e.target.value, { shouldValidate: true })
                  }
                  className="mt-2 h-[60px] w-full border border-lilac bg-white px-3 text-[#2c2c2c] outline-none"
                  type="email"
                  placeholder={messages.form_email_placeholder()}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </label>

              <label className="block text-[16px] text-[#2c2c2c]">
                {messages.form_phone()}*
                <input
                  {...register("phone")}
                  onChange={(e) =>
                    setValue("phone", e.target.value, { shouldValidate: true })
                  }
                  className="mt-2 h-[60px] w-full border border-lilac bg-white px-3 text-[#2c2c2c] outline-none"
                  type="text"
                  placeholder={messages.form_phone_placeholder()}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </label>
            </div>

            <div className="flex flex-col justify-between gap-4">
              <label className="block text-[16px] text-[#2c2c2c]">
                {messages.form_comments()}
                <textarea
                  {...register("comment")}
                  onChange={(e) =>
                    setValue("comment", e.target.value, { shouldValidate: true })
                  }
                  className="mt-2 h-[208px] w-full resize-none border border-lilac bg-white p-3 text-[#2c2c2c] outline-none"
                  placeholder={messages.form_comments_placeholder()}
                />
                {errors.comment && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.comment.message}
                  </p>
                )}
              </label>

              <label className="flex cursor-pointer items-center gap-3 text-[16px] text-[#2c2c2c]">
                <Controller
                  name="agreement"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <input
                      onChange={(e) =>
                        field.onChange(e.target.checked, { shouldValidate: true })
                      }
                      type="checkbox"
                      checked={field.value}
                      className="h-4 w-4"
                    />
                  )}
                />
                <span>{messages.form_agreement()}</span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <p className="text-[14px] text-[#2c2c2c]">
              * {messages.error_required()}
            </p>
            <button
              disabled={!isValid}
              className="ml-auto h-[50px] w-full rounded-full border-2 border-localbrown bg-brown-light px-6 text-sm text-localbrown disabled:border-brown-light disabled:bg-brown-light-light disabled:text-gray-500 md:w-[250px]"
              type="submit"
            >
              {messages.btn_submit()}
            </button>
          </div>
        </form>
      </Container>
    </section>
  );
}
