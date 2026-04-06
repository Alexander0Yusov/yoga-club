import Image from "next/image";
import Link from "next/link";

import logoImage from "/public/logo_icon.png";

type LogoProps = {
  href: string;
};

export default function Logo({ href }: LogoProps) {
  return (
    <Link href={href} aria-label="Yoga Club home" className="inline-flex">
      <Image
        src={logoImage}
        alt="Yoga Club"
        width={146}
        height={50}
        priority
        className="h-auto w-[146px] max-w-none"
      />
    </Link>
  );
}
