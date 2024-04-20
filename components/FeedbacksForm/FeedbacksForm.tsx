"use client";

import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

interface FeedbacksFormProps {
  selectedFeedback?: Record<string, string>;
  setShowModal: (arg: boolean) => void;
}
type FormValues = {
  myPost: string;
};

const schema = yup.object({
  myPost: yup
    .string()
    .trim()
    .required("Поле не має бути пустим")
    .min(20, "Мінімум 20 символів")
    .max(500, "Максимум 500 символів"),
});

const FeedbacksForm: React.FC<FeedbacksFormProps> = ({
  selectedFeedback,
  setShowModal,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { myPost: selectedFeedback?.text || "" },
    shouldFocusError: false,
    mode: "all",
    resolver: yupResolver(schema),
  });

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    submitHandler(data.myPost);
  };

  async function submitHandler(text: string) {
    setShowModal(false);

    const savingPromise = new Promise(async (resolve: any, reject) => {
      const result = await fetch(
        selectedFeedback ? "/api/myfeedbacks" : "/api/feedbacks",
        {
          method: selectedFeedback ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: selectedFeedback?._id || "",
            text,
          }),
        }
      );

      if (result.ok) {
        resolve();
      } else reject();
    });

    await toast.promise(
      savingPromise,
      {
        loading: "Обробка даних...",
        success: "Дані збережено",
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
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <label className=" relative">
        <p className=" mb-[8px]">Залиште ваш відгук</p>
        <textarea
          {...register("myPost")}
          onChange={(e) =>
            setValue("myPost", e.target.value, { shouldValidate: true })
          }
          rows={10}
          cols={50}
          placeholder={"Відгук"}
          className=" w-full h-[208px] p-[8px] resize-none rounded-[10px] border-[1px] border-lilac caret-black "
        />
        {errors.myPost && (
          <p className=" absolute right-0 top-0 text-red-600">
            {errors.myPost.message}
          </p>
        )}
      </label>

      <button
        type="submit"
        className="flex justify-center items-center ml-auto mt-[30px] w-[250px] h-[50px] bg-brown-light-light border-[1px] border-localbrown rounded-full"
      >
        Зберегти
      </button>
    </form>
  );
};

export default FeedbacksForm;
