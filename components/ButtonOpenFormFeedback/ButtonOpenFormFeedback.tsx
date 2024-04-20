"use client";

import React, { useState } from "react";
import { ModalWindow } from "../0_ui/ModalWindow/ModalWindow";
import { useSession } from "next-auth/react";
import FeedbacksForm from "../FeedbacksForm/FeedbacksForm";

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
        className=" absolute z-10 right-0 bottom-[140px] block ml-auto h-[50px] px-[20px] bg-brown-light-light rounded-full border-[1px] border-orange-950"
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
