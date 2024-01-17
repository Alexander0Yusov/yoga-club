"use client";

import Image from "next/image";
import Link from "next/link";

import logoImage from "/public/logo_icon.png";

const Logo = ({ className }: { className: string }) => {
  return (
    <Link
      href="/"
      aria-label=""
      className="block border-[1px] border-orange-950"
    >
      <Image src={logoImage} alt="Logo icon" width={146} height={50} />
    </Link>
  );
};

export default Logo;
