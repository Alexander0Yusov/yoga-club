"use client";

import React, { useState } from "react";
import ChevronDown from "../0_ui/ChevronDown";

import DateTimePicker from "../DateTimePicker/DateTimePicker";

import ImagesUrlList from "../ImagesUrlList/ImagesUrlList";
import SwitchInput from "../SwitchInput/SwitchInput";

const ButtonCreateEvent = ({
  idEvent,
  timeTarget: timeTarget_,
  title: title_,
  description: description_,
  picsArray: picsArray_,
}: {
  idEvent?: string;
  timeTarget?: string;
  title?: string;
  description?: string;
  picsArray?: { id: string; value: string }[];
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [timeTarget, setTimeTarget] = useState(timeTarget_ || "");
  const [title, setTitle] = useState(title_ || "");
  const [description, setDescription] = useState(description_ || "");
  const [picsArray, setPicsArray] = useState<{ id: string; value: string }[]>(
    picsArray_ || []
  );

  const resetInputs: any = () => {
    setTimeTarget("");
    setTitle("");
    setDescription("");
    setPicsArray([]);
  };

  const withoutIdNumbersArray: any = picsArray?.map(({ value }) => ({ value }));

  const postEvent = async () => {
    const result = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        timeTarget,
        description,
        picsArray: withoutIdNumbersArray,
      }),
    });

    return result;
  };

  const patchEvent = async () => {
    const result = await fetch("/api/event", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: idEvent,
        title,
        timeTarget,
        description,
        picsArray: withoutIdNumbersArray,
      }),
    });
    return result;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (idEvent) {
      const res = await patchEvent();
      console.log("tt", res);

      if (res.ok) {
        // e.target.reset();
        // resetInputs();

        const r = await res.json();
        console.log(r);
      }
    }

    if (!idEvent) {
      const res = await postEvent();

      if (res.ok) {
        // e.target.reset();
        // resetInputs();

        const r = await res.json();
        console.log(r);
      }
    }
  };

  return (
    <div className="flex flex-col items-center max-w-[900px] mx-auto mb-[30px] overflow-hidden border-[1px] border-orange-700 rounded-2xl">
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="flex items-center gap-2 border-[1px] border-orange-950"
      >
        {idEvent ? <span> Edit event</span> : <span> Create event</span>}
        {isFormOpen ? (
          <ChevronDown className="rotate-180 w-[16px] h-auto" />
        ) : (
          <ChevronDown className="w-[16px] h-auto" />
        )}
      </button>
      {/* save to localstorage */}
      {isFormOpen && (
        <div className="flex flex-col mt-6 gap-2 w-full border-[1px] border-orange-950">
          <div className="flex flex-wrap gap-2 justify-center border-[1px] border-orange-950">
            <label className="w-[350px] border-[1px] border-orange-950">
              <p>Title</p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="flex flex-col w-[350px]  border-[1px] border-orange-950">
              <p className="mb-4">Pick target time</p>

              <DateTimePicker
                timeTarget={timeTarget}
                setTimeTarget={setTimeTarget}
              />
            </label>
          </div>

          <div className="border-[1px] border-orange-950 ">
            {picsArray?.length > 0 && (
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
              value={description}
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
