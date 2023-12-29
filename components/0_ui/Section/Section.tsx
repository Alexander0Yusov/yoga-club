import React from "react";

const Section = ({
  children,
  className = "",
  id = "",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <section
      id={id}
      className={"w-full border-[1px] border-orange-950" + " " + className}
    >
      {children}
    </section>
  );
};

export default Section;
