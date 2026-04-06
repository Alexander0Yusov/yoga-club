"use client";

import React, { useState } from "react";

import { ModalWindow } from "@/shared/ui/ModalWindow/ModalWindow";
import useStore from "@/store/a_store";

import FeedbacksForm from "./FeedbacksForm";

const ButtonOpenFormFeedback = () => {
  const [modalState, setModalState] = useState(false);
  const user = useStore((state) => state.user);

  const onModalClose = () => {
    setModalState(false);
  };

  const showModal = () => {
    setModalState(true);
  };

  const isAuthenticated = Boolean(user?.email);

  return (
    <>
      <button
        type="button"
        className="block h-[50px] w-fit rounded-full border border-orange-950 bg-brown-light-light px-[20px] text-localbrown transition-colors hover:bg-[#81453e] hover:text-white"
        onClick={showModal}
      >
        {isAuthenticated
          ? "Оставить отзыв"
          : "Оставлять отзыв могут только зарегистрированные пользователи"}
      </button>

      {isAuthenticated && (
        <ModalWindow onModalClose={onModalClose} showModal={modalState}>
          <FeedbacksForm setShowModal={setModalState} />
        </ModalWindow>
      )}
    </>
  );
};

export default ButtonOpenFormFeedback;
