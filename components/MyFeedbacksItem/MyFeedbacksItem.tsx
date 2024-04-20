import React from "react";
import IconEdit from "../0_ui/IconEdit";
import IconDelete from "../0_ui/IconDelete";

const MyFeedbacksItem = ({
  id,
  date,
  text,
  edit,
  del,
}: {
  id: any;
  date: any;
  text: any;
  edit: any;
  del: any;
}) => {
  const originalDate = new Date(date);

  const year = originalDate.getFullYear();
  const month = String(originalDate.getMonth() + 1).padStart(2, "0");
  const day = String(originalDate.getDate()).padStart(2, "0");

  return (
    <div className="flex items-start border-[1px] border-slate-700">
      <p className="w-[210px] mr-[5px] ">{`${year}-${month}-${day}`}</p>
      <p className="w-[1060px] p-[16px] mr-[18px] overflow-x-hidden rounded-[10px] border-[1px] border-lilac">
        {text.substring(0, 160) + "..."}
      </p>
      <button className=" mr-[10px]" onClick={() => edit(id)}>
        <IconEdit />
      </button>
      <button onClick={() => del(id)}>
        <IconDelete />
      </button>
    </div>
  );
};

export default MyFeedbacksItem;
