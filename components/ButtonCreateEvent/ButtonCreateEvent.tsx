"use client";
import React, { useState } from "react";
import ChevronDown from "../ChevronDown";
import { useSession } from "next-auth/react";
import DateTimePicker from "../DateTimePicker/DateTimePicker";

import ImagesUrlList from "../ImagesUrlList/ImagesUrlList";
import SwitchInput from "../SwitchInput/SwitchInput";

const ButtonCreateEvent = () => {
  const [openForm, setOpenForm] = useState(false);

  const [timeTarget, setTimeTarget] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [picsArray, setPicsArray] = useState<{ id: string; value: string }[]>(
    []
  );

  const session = useSession();

  const resetInputs: any = () => {
    setTimeTarget("");
    setTitle("");
    setDescription("");
    setPicsArray([]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const withoutIdNumbersArray = picsArray.map(({ value }) => ({ value }));

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        timeTarget,
        description,
        picsArray: withoutIdNumbersArray,
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
    <div className="flex flex-col items-center max-w-[900px] mx-auto overflow-hidden border-[1px] border-orange-950 rounded-2xl">
      <button
        onClick={() => setOpenForm(!openForm)}
        className="flex items-center gap-2 border-[1px] border-orange-950"
      >
        Create event
        {openForm ? (
          <ChevronDown className="rotate-180 w-[16px] h-auto" />
        ) : (
          <ChevronDown className="w-[16px] h-auto" />
        )}
      </button>
      {/* save to localstorage */}
      {openForm && (
        <div className="flex flex-col mt-6 gap-2 w-full border-[1px] border-orange-950">
          <div className="flex flex-wrap gap-2 justify-center border-[1px] border-orange-950">
            <label className="w-[350px] border-[1px] border-orange-950">
              <p>Title</p>
              <input type="text" onChange={(e) => setTitle(e.target.value)} />
            </label>

            <label className="w-[350px] border-[1px] border-orange-950">
              <p>Pick target time</p>

              <DateTimePicker
                timeTarget={timeTarget}
                setTimeTarget={setTimeTarget}
              />
            </label>
          </div>

          <div className="border-[1px] border-orange-950 ">
            {picsArray.length > 0 && (
              <ImagesUrlList
                picsArray={picsArray}
                setPicsArray={setPicsArray}
              />
            )}
            <SwitchInput picsArray={picsArray} setPicsArray={setPicsArray} />
          </div>

          <label className=" border-[1px] border-orange-950">
            <p>Description</p>
            <textarea
              rows={10}
              cols={50}
              onChange={(e) => setDescription(e.target.value)}
              className=" w-full h-[80px] resize-none"
            />
          </label>

          <button
            onClick={handleSubmit}
            type="button"
            className="w-[200px] mx-auto border-[1px] border-orange-950"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ButtonCreateEvent;
