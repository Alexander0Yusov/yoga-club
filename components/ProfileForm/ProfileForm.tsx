"use client";
import React, { useRef, useState } from "react";

const ProfileForm = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<Blob>();
  const filePicker: React.LegacyRef<HTMLInputElement> | undefined =
    useRef(null);

  const imageChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const files = e.target.files || null;
    files && files.length > 0 && setImage(files[0]);
  };

  const handlerSubmit = async (e: any) => {
    e.preventDefault();

    //  const formData = new FormData(e.target);
    const formData = new FormData();
    if (name) {
      formData.append("name", name);
    }
    if (image) {
      formData.append("image", image);
    }

    const res = await fetch("/api/user", {
      method: "PATCH",
      body: formData,
      // headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("form with portrait send", res.ok);
  };

  return (
    <form onSubmit={handlerSubmit}>
      <label className="flex flex-col">
        Name
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <button
        onClick={() => {
          filePicker.current?.click();
        }}
      >
        Pick image
      </button>

      <input
        className="hidden"
        ref={filePicker}
        type="file"
        onChange={imageChangeHandler}
        accept="image/*"
      />

      <button className="block">Ok</button>
    </form>
  );
};

export default ProfileForm;
