"use client";

import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FeedbacksFormProps {
  selectedFeedback?: {
    _id?: string;
    comment?: string;
    text?: string;
    rating?: number;
  };
  setShowModal: (arg: boolean) => void;
}

type FormValues = {
  comment: string;
  rating: number;
};

const schema = yup.object({
  comment: yup
    .string()
    .trim()
    .required("Field cannot be empty")
    .min(20, "Minimum 20 characters")
    .max(500, "Maximum 500 characters"),
  rating: yup.number().min(1).max(5).required(),
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
  } = useForm<FormValues>({
    defaultValues: {
      comment: selectedFeedback?.comment || selectedFeedback?.text || "",
      rating: selectedFeedback?.rating || 5,
    },
    shouldFocusError: false,
    mode: "all",
    resolver: yupResolver(schema),
  });

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    submitHandler(data.comment, data.rating);
  };

  async function submitHandler(comment: string, rating: number) {
    setShowModal(false);

    const savingPromise = new Promise<void>(async (resolve, reject) => {
      const result = await fetch(selectedFeedback ? "/api/myfeedbacks" : "/api/feedbacks", {
        method: selectedFeedback ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: selectedFeedback?._id || "",
          comment,
          text: comment,
          rating,
        }),
      });

      if (result.ok) {
        resolve();
      } else {
        reject(new Error("Failed to save feedback"));
      }
    });

    await toast.promise(savingPromise, {
      loading: "Saving...",
      success: "Saved",
      error: "Save failed",
    });

    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <label className="relative block">
        <p className="mb-[8px]">Leave your feedback</p>
        <textarea
          {...register("comment")}
          onChange={(e) =>
            setValue("comment", e.target.value, { shouldValidate: true })
          }
          rows={10}
          cols={50}
          placeholder="Feedback"
          className="h-[208px] w-full resize-none rounded-[10px] border-[1px] border-lilac p-[8px] caret-black"
        />
        {errors.comment && (
          <p className="absolute right-0 top-0 text-red-600">
            {errors.comment.message}
          </p>
        )}
      </label>

      <label className="mt-4 block">
        <span className="mb-2 block">Rating</span>
        <select
          {...register("rating", { valueAsNumber: true })}
          onChange={(e) =>
            setValue("rating", Number(e.target.value), { shouldValidate: true })
          }
          className="h-[44px] w-[120px] rounded-[10px] border-[1px] border-localbrown bg-white px-[10px] text-localbrown"
        >
          <option value={5}>5</option>
          <option value={4}>4</option>
          <option value={3}>3</option>
          <option value={2}>2</option>
          <option value={1}>1</option>
        </select>
      </label>

      <button
        type="submit"
        className="ml-auto mt-[30px] flex h-[50px] w-[250px] items-center justify-center rounded-full border-[1px] border-localbrown bg-brown-light-light"
      >
        Save
      </button>
    </form>
  );
};

export default FeedbacksForm;
