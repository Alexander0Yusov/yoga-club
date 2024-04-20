"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import FeedbacksItem from "../FeedbacksItem/FeedbacksItem";

const FeedbacksGallery = () => {
  const [feedbacks, setFeedbacks] = useState<any>([]);

  useEffect(() => {
    const getFeedbacks = async () => {
      const result = await fetch("/api/feedbacks");

      const res = await result.json();

      setFeedbacks(res);

      console.log("FBcks", res);
    };

    getFeedbacks();
  }, []);

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
        {feedbacks.map((item: any) => (
          <li key={item._id}>
            <FeedbacksItem
              id={item._id}
              date={item.createdAt}
              text={item.text}
              del={delHandler}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default FeedbacksGallery;
