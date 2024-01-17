import React from "react";
import Link from "next/link";

const LinkAncor = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="flex items-center justify-center rounded-full w-[250px] h-[50px] font-inter text-fs16 border-[1px] border-localbrown bg-brown-light-light "
    >
      {children}
    </Link>
  );
};

export default LinkAncor;
