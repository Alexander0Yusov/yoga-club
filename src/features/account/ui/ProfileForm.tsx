"use client";

import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Controller,
  SubmitHandler,
  type Resolver,
  useForm,
} from "react-hook-form";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";

import useStore from "@/store/a_store";
import { updateUserProfile, updateUserViewMode } from "@/shared/api/client";
import ChevronDown from "@/shared/ui/ChevronDown";

type ViewMode = "USER" | "ADMIN" | "SUPERADMIN";

type FormValues = {
  nickname: string;
  phone: string;
  isSubscribed: boolean;
};

const schema = yup.object({
  nickname: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .min(2, "Minimum 2 characters")
    .max(50, "Maximum 50 characters"),
  phone: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .matches(RegExp("^\\+.*$"), "Must start with +")
    .min(12, "Minimum 11 digits")
    .matches(RegExp("^\\+\\d*$"), "Digits only after +")
    .max(13, "Maximum 12 digits"),
  isSubscribed: yup.boolean().oneOf([true, false]),
});

const ProfileForm = () => {
  const session = useSession();
  const { user, setUser, setViewMode, getCurrentUser } = useStore();

  const [portrait, setPortrait] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const filePicker = useRef<HTMLInputElement>(null);
  const loadedCurrentUserRef = useRef(false);

  useEffect(() => {
    if (session.status === "authenticated" && !loadedCurrentUserRef.current) {
      loadedCurrentUserRef.current = true;
      void getCurrentUser();
    }
  }, [session.status, getCurrentUser]);

  useEffect(() => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPortrait(reader.result as string);
    };
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
      nickname: user?.nickname,
      phone: user?.phone,
      isSubscribed: user?.isSubscribed,
    },
    shouldFocusError: false,
    mode: "all",
    resolver: yupResolver(schema) as Resolver<FormValues>,
  });

  useEffect(() => {
    setValue("nickname", user?.nickname === "" ? user?.name : user?.nickname);
    setValue("phone", user?.phone);
    setValue("isSubscribed", user?.isSubscribed);
  }, [user?.nickname, user?.name, user?.phone, user?.isSubscribed, setValue]);

  const imageChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    const files = e.target.files || null;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handlerSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = new FormData();
    formData.append(
      "nickname",
      data.nickname === undefined ? "" : data.nickname,
    );
    formData.append("phone", data.phone === undefined ? "" : data.phone);
    formData.append("isSubscribed", String(data.isSubscribed));

    reset();

    if (file) {
      formData.append("isFileExists", "true");
      formData.append("file", file);
      setFile(null);
      setPortrait("");
    }

    const userPatchPromise = updateUserProfile({
      formData,
    }).then((userInfo) => {
      setUser(userInfo as Parameters<typeof setUser>[0]);
    });

    await toast.promise(userPatchPromise, {
      loading: "Saving...",
      success: "Saved",
      error: "Save failed",
    });
  };

  const isSuperAdmin =
    user?.email === "yusovsky2@gmail.com" ||
    user?.originalRole === "SUPERADMIN";

  const handleViewModeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const nextViewMode = event.target.value as ViewMode;

    if (!user?.email) {
      toast.error("User email is required");
      return;
    }

    try {
      await updateUserViewMode({
        userEmail: user.email,
        viewMode: nextViewMode,
      });
      setViewMode(nextViewMode);
      setUser({ viewMode: nextViewMode });
      toast.success("View mode updated");
      window.location.reload();
    } catch {
      toast.error("Failed to update view mode");
    }
  };

  return (
    user && (
      <>
        <div className="flex items-center border-b-[1px] border-lilac pb-[30px]">
          <p className="w-[323px] text-cadetblue">Profile photo</p>
          <div
            id="thumb"
            className="relative h-[70px] w-[70px] overflow-hidden rounded-full border-[1px]"
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
            className="ml-auto flex h-[40px] w-[40px] items-center justify-center"
            onClick={() => filePicker.current?.click()}
          >
            <ChevronDown className="w-[20px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handlerSubmit)}>
          <label className="flex h-[73px] items-center border-b-[1px] border-lilac">
            <span className="w-[323px] text-cadetblue">Name</span>
            <input
              {...register("nickname")}
              onChange={(e) =>
                setValue("nickname", e.target.value, { shouldValidate: true })
              }
              className="w-[300px] px-[4px]"
              type="text"
              placeholder="Name"
            />
            {errors.nickname && (
              <p className="ml-[8px] text-red-600">{errors.nickname.message}</p>
            )}
          </label>

          <label className="flex h-[73px] items-center border-b-[1px] border-lilac">
            <span className="w-[323px] text-cadetblue">Phone</span>
            <input
              {...register("phone")}
              onChange={(e) =>
                setValue("phone", e.target.value, { shouldValidate: true })
              }
              className="w-[300px] px-[4px]"
              type="text"
              placeholder="+380991234567"
            />
            {errors.phone && (
              <p className="ml-[8px] text-red-600">{errors.phone.message}</p>
            )}
          </label>

          <label className="flex h-[73px] items-center border-b-[1px] border-lilac">
            <span className="w-[323px] text-cadetblue">Email</span>
            <input
              className="appearance-none text-gray-900"
              type="text"
              placeholder={user.email}
              disabled
            />
          </label>

          <label className="flex h-[73px] cursor-pointer items-center border-b-[1px] border-lilac">
            <span className="w-[323px] text-cadetblue">Receive updates</span>
            <Controller
              name="isSubscribed"
              control={control}
              defaultValue={false}
              render={({
                field,
              }: {
                field: { value: boolean; onChange: (checked: boolean) => void };
              }) => (
                <input
                  onChange={(e) => field.onChange(e.target.checked)}
                  type="checkbox"
                  checked={Boolean(field.value)}
                  className="cursor-pointer"
                />
              )}
            />
          </label>

          {isSuperAdmin && (
            <label className="flex h-[73px] items-center border-b-[1px] border-lilac">
              <span className="w-[323px] text-[18px] text-cadetblue">
                View Mode
              </span>
              <select
                value={user?.viewMode || user?.role || "USER"}
                onChange={handleViewModeChange}
                className="h-[40px] w-[300px] rounded-[10px] border-[1px] border-localbrown bg-white px-[10px] text-localbrown"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERADMIN">SUPERADMIN</option>
              </select>
            </label>
          )}

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
            className="mx-auto mt-[20px] block h-[30px] w-[92px] rounded-[10px] border-[1px] border-localbrown text-localbrown"
          >
            Save
          </button>
        </form>
      </>
    )
  );
};

export default ProfileForm;
