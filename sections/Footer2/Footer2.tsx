import Container from "@/components/0_ui/Container/Container";
import IconFacebook from "@/components/0_ui/IconFacebook";
import IconInstagram from "@/components/0_ui/IconInstagram";
import IconTelegram from "@/components/0_ui/IconTelegram";
import IconYutube from "@/components/0_ui/IconYutube";
import HeaderNavbar from "@/components/HeaderNavbar/HeaderNavbar";
import HomeAncorsFooter from "@/components/HomeAncorsFooter/HomeAncorsFooter";
import Logo from "@/components/Logo/Logo";
import Link from "next/link";
import React from "react";

const Footer2 = () => {
  return (
    <footer className="w-full h-[170px] pt-[30px] font-mulish text-fs18 bg-[#dfd9dc] border-[1px] border-orange-950">
      <Container className="flex justify-between items-start border-[1px] border-orange-950 ">
        <Logo className=" h-[50px]" />

        <HomeAncorsFooter />

        <div id="footerContacts">
          <p className="mb-[10px]">Контакти:</p>
          <ul>
            <li className="mb-[10px]">
              <Link href={"tel:+380955553322"}>+38(095) 555 -33 -22</Link>
            </li>
            <li>
              <Link href={"email:nadyakorableva@gmail.com"}>
                nadyakorableva@gmail.com
              </Link>
            </li>
          </ul>
        </div>

        <div
          id="footerSocials"
          className=" flex flex-col justify-between border-[1px] border-localbrown"
        >
          <p className=" leading-[1.72] mb-[26px]">Ми в соцмережах</p>

          <ul className="flex gap-[20px] ">
            <li>
              <Link
                href={"https://www.youtube.com"}
                target="_blank"
                rel="noreferrer noopener nofollow"
              >
                <IconYutube />
              </Link>
            </li>
            <li>
              <Link
                href={"https://www.facebook.com"}
                target="_blank"
                rel="noreferrer noopener nofollow"
              >
                <IconFacebook />
              </Link>
            </li>
            <li>
              <Link
                href={"https://www.instagram.com"}
                target="_blank"
                rel="noreferrer noopener nofollow"
              >
                <IconInstagram />
              </Link>
            </li>
            <li>
              <Link
                href={"https://www.telegram.com"}
                target="_blank"
                rel="noreferrer noopener nofollow"
              >
                <IconTelegram />
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
};

export default Footer2;
