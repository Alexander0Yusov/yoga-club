"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";

import { ModalWindow } from "@/shared/ui/ModalWindow/ModalWindow";
import FeedbacksForm from "./FeedbacksForm";

const ButtonOpenFormFeedback = () => {
  const [modalState, setModalState] = useState(false);
  const session = useSession();

  const onModalClose = () => {
    setModalState(false);
  };
  const showModal = () => {
    setModalState(true);
  };

  return (
    <>
      <button
        className="block h-[50px] w-fit rounded-full border-[1px] border-orange-950 bg-brown-light-light px-[20px]"
        onClick={showModal}
      >
        {session.status === "authenticated"
          ? "Залишити відгук"
          : "Залишати відгук можуть тільки зареєстровані користувачі"}
      </button>

      {session.status === "authenticated" && (
        <ModalWindow onModalClose={onModalClose} showModal={modalState}>
          <FeedbacksForm setShowModal={setModalState} />
        </ModalWindow>
      )}
    </>
  );
};

export default ButtonOpenFormFeedback;
