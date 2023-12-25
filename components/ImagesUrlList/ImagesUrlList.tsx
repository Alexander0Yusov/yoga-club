import React from "react";

const ImagesUrlList = ({
  picsArray,
  setPicsArray,
}: {
  picsArray: { id: string; value: string }[];
  setPicsArray: any;
}) => {
  return (
    <ul className="flex flex-col gap-2 mb-3 border-[1px] border-orange-950 ">
      {picsArray.map(({ id, value }, index) => (
        <li key={id} className=" border-[1px] border-orange-950">
          <div className="flex justify-between w-full h-[28px] border-[1px] border-orange-950">
            <p className="h-full overflow-hidden border-[1px] border-orange-700 ">
              <span>{`${index + 1}. `}</span>
              <span>{value}</span>
            </p>
            <button
              className=" border-[1px] border-orange-700"
              onClick={() =>
                setPicsArray((prev: any) =>
                  prev.filter((el: any) => el.id !== id)
                )
              }
            >
              Del
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ImagesUrlList;
