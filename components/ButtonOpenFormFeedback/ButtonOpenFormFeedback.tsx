"use client";

import React, { useState } from "react";
import { ModalWindow } from "../0_ui/ModalWindow/ModalWindow";
import { useSession } from "next-auth/react";

const ButtonOpenFormFeedback = () => {
  const [modalState, setModalState] = useState(false);
  const session = useSession();

  const onModalClose = () => {
    setModalState(false);
  };
  const showModal = () => {
    setModalState(true);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e: any
  ) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const res = await (
      await fetch("/api/feedbacks", {
        method: "POST",
        body: formData,
      })
    ).json();

    console.log("res", res);

    e.target.reset();
  };

  return (
    <>
      <button
        className=" absolute z-10 right-0 bottom-[140px] block ml-auto h-[50px] px-[20px] bg-brown-light-light rounded-full border-[1px] border-orange-950"
        onClick={showModal}
      >
        {session.status === "authenticated"
          ? "Залишити відгук"
          : "Залишати відгук можуть тільки зареєстровані користувачі"}
      </button>

      {session.status === "authenticated" && (
        <ModalWindow onModalClose={onModalClose} showModal={modalState}>
          <form
            onSubmit={handleSubmit}
            className="border-[1px] border-orange-950"
          >
            <label>
              <p className="">Залиште ваш відгук</p>

              <textarea
                name="feedback"
                rows={5}
                className=" resize-none w-[400px]"
              />
            </label>

            <button
              type="submit"
              className="block border-[1px] border-orange-950"
            >
              Send
            </button>
          </form>
        </ModalWindow>
      )}
    </>
  );
};

export default ButtonOpenFormFeedback;
