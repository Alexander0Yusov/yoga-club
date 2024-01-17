import Image from "next/image";
import Link from "next/link";
import React from "react";

import announceImage from "@/public/events_announce.jpg";
import archiveImage from "@/public/events_archive.jpg";

import "./styles.css";

const EventLink = ({
  lang,
  targetPage,
}: {
  lang: string;
  targetPage: string;
}) => {
  return (
    <Link
      id="myLink"
      href={`${lang}/${targetPage}`}
      className=" relative border-[1px] border-orange-950"
    >
      <div
        id="eventLink"
        className="  relative overflow-hidden w-[683px] h-[480px]"
      >
        <Image
          className="zoom-image h-full w-full object-cover object-center "
          src={targetPage === "events" ? announceImage : archiveImage}
          alt={"some content"}
          width={683}
          height={480}
        />
      </div>

      <p className=" absolute flex justify-between items-center w-full h-[70px] px-[12px] bg-white/60 bottom-[20px] text-cadetblue text-bold ">
        <span className="text-fs24">
          {targetPage === "events" ? "Анонси подій" : "Архів подій"}
        </span>
        <span className=" text-fs18">Детальніше</span>
      </p>
    </Link>
  );
};

export default EventLink;
