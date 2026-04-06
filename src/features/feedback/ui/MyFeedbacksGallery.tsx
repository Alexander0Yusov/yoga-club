"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getMyFeedbacks, softDeleteFeedback } from "@/shared/api/client";
import { ModalWindow } from "@/shared/ui/ModalWindow/ModalWindow";

import FeedbacksForm from "./FeedbacksForm";
import MyFeedbacksItem from "./MyFeedbacksItem";

type MyFeedbackRow = {
  _id: string;
  createdAt?: string;
  date?: string;
  comment?: string;
  text?: string;
  rating?: number;
};

export default function MyFeedbacksGallery() {
  const [myFeedbacks, setMyFeedbacks] = useState<MyFeedbackRow[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<MyFeedbackRow | null>(null);

  useEffect(() => {
    const getMyFeedbacksList = async () => {
      const result = await getMyFeedbacks<MyFeedbackRow[]>();
      setMyFeedbacks(result);
    };

    void getMyFeedbacksList();
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
      <ul className="flex flex-col gap-4">
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
        <FeedbacksForm
          selectedFeedback={selectedFeedback || undefined}
          setShowModal={setShowModal}
        />
      </ModalWindow>
    </>
  );
}
