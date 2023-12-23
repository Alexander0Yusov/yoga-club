"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ProfileForm = () => {
  const filePicker: React.LegacyRef<HTMLInputElement> | undefined =
    useRef(null);

  const [email, setEmail] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [image, setImage] = useState<string>("");
  const [portrait, setPortrait] = useState<string>("");
  const [file, setFile] = useState<any>(null);

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

  useEffect(() => {
    const getData = async () => {
      const {
        email: email_,
        portrait: portrait_,
        image: image_,
        name: name_,
        nickname: nickname_,
        phone: phone_,
      } = await (await fetch("/api/userCurrent")).json();

      setImage(image_ || "");
      setPortrait(portrait_ || "");
      setPhone(phone_ || "");
      setEmail(email_ || "");

      if (!nickname_) {
        setNickname(name_ || "");
      } else {
        setNickname(nickname_);
      }
    };

    getData();
  }, []);

  const imageChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const files = e.target.files || null;
    files && files.length > 0 && setFile(files[0]);
  };

  // система тостифай 4/ 23 мин
  // ресайз картинок по докам клаудинария
  const handlerSubmit = async (e: any) => {
    e.preventDefault();

    // const formData = new FormData(e.target);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("nickname", nickname);
    formData.append("phone", phone);

    try {
      const userInfo = await (
        await fetch("/api/user", {
          method: "PATCH",
          body: formData,
        })
      ).json();

      console.log(userInfo);

      setPortrait(userInfo?.portrait || "");
      setNickname(userInfo?.nickname || "");
      setPhone(userInfo?.phone || "");
    } catch (error) {}

    console.log("fetch end");
  };

  return (
    <>
      {(portrait || image) && (
        <div
          id="thumb"
          className="relative border-[1px] border-lime-400 w-[100px] h-[100px] mb-4 mx-auto"
        >
          <Image
            className=""
            src={portrait || image}
            fill
            sizes="500px"
            style={{
              objectFit: "cover",
            }}
            alt="User portrait"
          />
        </div>
      )}
      <form
        onSubmit={handlerSubmit}
        className="border-[1px] border-orange-950 "
      >
        <label className="flex flex-col border-[1px] border-lime-400 mb-2">
          Name
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </label>

        {/* Ругается на этот элемент, компонент перевести на контролируемый */}
        <label className="flex flex-col border-[1px] border-lime-400 mb-2">
          Phone
          <input
            name="phone"
            type="text"
            placeholder="+380991234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label className="flex flex-col border-[1px] border-lime-400 mb-2">
          Email
          <input
            className=" appearance-none bg-gray-200  text-gray-900 "
            type="text"
            placeholder={email}
            disabled={true}
          />
        </label>

        <button
          type="button"
          className="flex w-full justify-center border-[1px] border-lime-400 mb-2"
          onClick={() => {
            filePicker.current?.click();
          }}
        >
          Pick image
        </button>

        {/*Fileinput it is hidden */}
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
          className="flex w-full justify-center border-[1px] border-lime-400"
        >
          Apply
        </button>
      </form>
    </>
  );
};

export default ProfileForm;
