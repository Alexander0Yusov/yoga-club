"use client";
import React, { useState } from "react";
import ChevronDown from "../ChevronDown";
import { useSession } from "next-auth/react";

const ButtonCreateEvent = () => {
  const [openForm, setOpenForm] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [timeTarget, setTimeTarget] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const session = useSession();

  const resetInputs: any = () => {
    setImageUrl("");
    setVideoUrl("");
    setTimeTarget("");
    setTitle("");
    setDescription("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session?.data?.user?.email || "",
        imageUrl,
        videoUrl,
        timeTarget,
        title,
        description,
      }),
    });

    if (res.ok) {
      // e.target.reset();
      // resetInputs();

      const r = await res.json();
      console.log(r);
    }
  };

  return (
    <div className="flex flex-col items-center border-[1px] border-orange-950 rounded-2xl">
      <button
        onClick={() => setOpenForm(!openForm)}
        className="flex items-center"
      >
        Create event
        {openForm ? (
          <ChevronDown className="rotate-180 w-[16px] h-auto" />
        ) : (
          <ChevronDown className="w-[16px] h-auto" />
        )}
      </button>
      {openForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 border-[1px] border-orange-950"
        >
          <label>
            <p>Pick target time</p>

            {/* <DateTimePicker /> */}
          </label>

          <label>
            <p>Image link</p>

            <input type="text" onChange={(e) => setImageUrl(e.target.value)} />
          </label>

          <label>
            <p>Video link</p>
            <input type="text" onChange={(e) => setVideoUrl(e.target.value)} />
          </label>

          <label>
            <p>Time</p>
            <input
              type="text"
              onChange={(e) => setTimeTarget(e.target.value)}
            />
          </label>

          <label>
            <p>Title</p>
            <input type="text" onChange={(e) => setTitle(e.target.value)} />
          </label>

          <label>
            <p>Description</p>
            <input
              type="text"
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
};

export default ButtonCreateEvent;
