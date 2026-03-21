"use client";

import React, { useEffect, useState } from "react";

import { ModalWindow } from "../0_ui/ModalWindow/ModalWindow";
import FeedbacksForm from "../FeedbacksForm/FeedbacksForm";
import MyFeedbacksItem from "../MyFeedbacksItem/MyFeedbacksItem";
import { softDeleteFeedback } from "@/shared/api/client";
import toast from "react-hot-toast";

type MyFeedbackRow = {
  _id: string;
  createdAt?: string;
  date?: string;
  comment?: string;
  text?: string;
  rating?: number;
};

const MyFeedbacksGallery = () => {
  const [myFeedbacks, setMyFeedbacks] = useState<MyFeedbackRow[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<MyFeedbackRow | null>(null);

  useEffect(() => {
    const getMyFeedbacks = async () => {
      const result = await fetch("/api/myfeedbacks");
      const res = (await result.json()) as MyFeedbackRow[];
      setMyFeedbacks(res);
    };

    void getMyFeedbacks();
  }, []);

  const editHandler = (id: string) => {
    setShowModal(true);
    setSelectedFeedback(myFeedbacks.find(({ _id }) => _id === id) || null);
  };

  const delHandler = async (id: string) => {
    await softDeleteFeedback({ id });
    toast.success("Moved to trash");
    window.location.reload();
  };

  return (
    <>
      <ul className="flex flex-col gap-[20px]">
        {myFeedbacks.map((item) => (
          <li key={item._id}>
            <MyFeedbacksItem
              id={item._id}
              date={item.date || item.createdAt || ""}
              text={item.comment || item.text || ""}
              edit={editHandler}
              del={delHandler}
            />
          </li>
        ))}
      </ul>

      <ModalWindow onModalClose={() => setShowModal(false)} showModal={showModal}>
        <FeedbacksForm selectedFeedback={selectedFeedback || undefined} setShowModal={setShowModal} />
      </ModalWindow>
    </>
  );
};

export default MyFeedbacksGallery;
