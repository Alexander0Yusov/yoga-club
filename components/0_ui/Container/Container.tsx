import React from "react";

const Container: React.FC<any> = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={
        "w-full mx-auto w480:w-[480px] w768:w-[768px] w1280:w-[1280px] w1440:w-[1440px] border-[1px] border-orange-950" +
        " " +
        className
      }
    >
      {children}
    </div>
  );
};

export default Container;
