import React from "react";
import FeedbacksItem from "../FeedbacksItem/FeedbacksItem";

const FeedbacksGallery = async () => {
  const getFeedbacks = await import("../../app/api/feedbacks/route");

  const feedbacks = await (await getFeedbacks.GET()).json();

  // console.log(88, feedbacks);

  return (
    //  <></>
    <ul className="flex  flex-wrap w-full gap-[16px]">
      {feedbacks.map(
        ({
          _id,
          text,
          owner: { name, image },
          ownerInfo: { nickname, portrait },
          createdAt,
        }: {
          _id: string;
          text: string;
          owner: any;
          ownerInfo: any;
          createdAt: string;
        }) => (
          <li key={_id}>
            <FeedbacksItem
              text={text}
              name={nickname || name}
              image={portrait || image}
              createdAt={createdAt}
            />
          </li>
        )
      )}
    </ul>
  );
};

export default FeedbacksGallery;
