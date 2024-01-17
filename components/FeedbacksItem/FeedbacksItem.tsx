import React from "react";

const FeedbacksItem = ({ text, name, image, createdAt }: any) => {
  return (
    <div>
      <p>{createdAt}</p>
      <p>{text}</p>
      <p>{name}</p>
      <p>{image}</p>
    </div>
  );
};

export default FeedbacksItem;
