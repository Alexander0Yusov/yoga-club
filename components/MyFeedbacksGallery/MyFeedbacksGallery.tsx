"use client";

import React, { useEffect, useState } from "react";
import MyFeedbacksItem from "../MyFeedbacksItem/MyFeedbacksItem";
import { ModalWindow } from "../0_ui/ModalWindow/ModalWindow";
import FeedbacksForm from "../FeedbacksForm/FeedbacksForm";
import toast from "react-hot-toast";

const MyFeedbacksGallery = () => {
  const [myFeedbacks, setMyFeedbacks] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  useEffect(() => {
    const getMyFeedbacks = async () => {
      const result = await fetch("/api/myfeedbacks");

      const res = await result.json();

      setMyFeedbacks(res);

      console.log("My FBcks", res);
    };

    getMyFeedbacks();
  }, []);

  const editHandler = (id: any) => {
    setShowModal(true);

    setSelectedFeedback(
      myFeedbacks.find(({ _id }: { _id: any }) => _id === id)
    );
  };

  const delHandler = async (id: any) => {
    let isDelAllowed = confirm("Підтверджуєте видалення?");
    if (!isDelAllowed) return;

    const deletingPromise = new Promise(async (resolve: any, reject) => {
      const result = await fetch("/api/feedbacks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
        }),
      });

      if (result.ok) {
        resolve();
      } else reject();
    });

    await toast.promise(
      deletingPromise,
      {
        loading: "Обробка даних...",
        success: "Дані збережено",
        error: "Помилка збереження",
      },
      {
        success: {
          duration: 2500,
        },
        error: {
          duration: 4000,
        },
      }
    );
  };

  return (
    <>
      <ul className="flex flex-col gap-[50px]">
        {myFeedbacks.map((item: any) => (
          <li key={item._id}>
            <MyFeedbacksItem
              id={item._id}
              date={item.createdAt}
              text={item.text}
              edit={editHandler}
              del={delHandler}
            />
          </li>
        ))}
      </ul>

      <ModalWindow
        onModalClose={() => setShowModal(false)}
        showModal={showModal}
      >
        <FeedbacksForm
          selectedFeedback={selectedFeedback}
          setShowModal={setShowModal}
        />
      </ModalWindow>
    </>
  );
};

export default MyFeedbacksGallery;
