"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ChevronDown from "../0_ui/ChevronDown";

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

      if (nickname_) {
        setNickname(nickname_);
      } else {
        setNickname(name_ || "");
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

    const formData = new FormData(e.target);

    if (file) {
      formData.append("isFileExists", true as any);
      setFile(null);
    }

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

    e.target.reset();
    console.log("fetch end");
  };

  return (
    <>
      {(portrait || image) && (
        <div className="flex items-center pb-[30px] border-b-[1px] border-lilac">
          <p className="w-[323px] text-cadetblue">Фото профілю</p>
          <div
            id="thumb"
            className="relative border-[1px] w-[70px] h-[70px] rounded-full overflow-hidden"
          >
            <Image
              src={portrait || image}
              alt="User portrait"
              width={70}
              height={70}
              className="h-full w-full object-cover object-center"
            />
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
      )}

      <form onSubmit={handlerSubmit} className="  ">
        <label className="flex items-center h-[73px] border-b-[1px] border-lilac">
          <span className="w-[323px] text-cadetblue">{"Імя"}</span>
          <input
            className=" w-[300px]"
            name="nickname"
            type="text"
            placeholder="Name"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </label>

        {/* Ругается на этот элемент, компонент перевести на контролируемый */}
        <label className="flex items-center h-[73px] border-b-[1px] border-lilac">
          <span className="w-[323px] text-cadetblue">Телефон</span>
          <input
            className=" w-[300px]"
            name="phone"
            type="text"
            placeholder="+380991234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label className="flex items-center h-[73px] border-b-[1px] border-lilac">
          <span className="w-[323px] text-cadetblue">Електронна пошта</span>
          <input
            className=" appearance-none text-gray-900 "
            type="text"
            placeholder={email}
            disabled={true}
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
  );
};

export default ProfileForm;
