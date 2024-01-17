"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, FreeMode } from "swiper/modules";
import ArrowsBlock from "../ArrowsBlock/ArrowsBlock";

import { advantages_lib } from "@/lib/dataAdvantages";

// Import Swiper styles
import "swiper/css";
import "swiper/css/keyboard";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { useState } from "react";
import { ModalWindow } from "../0_ui/ModalWindow/ModalWindow";

// import "./styles.css";

export default function DemoVideosSlider() {
  const [modalState, setModalState] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");

  const onModalClose = () => {
    setModalState(false);
  };
  const showModal = (id: any) => {
    setCurrentVideo(id);
    setModalState(true);
  };

  const arr = [
    "https://www.youtube.com/watch?v=a3uNHHLe06E",
    "https://www.youtube.com/watch?v=CfvceanvDk8",
    "https://www.youtube.com/watch?v=gJoUCdGqYSY",
    "https://www.youtube.com/watch?v=xtbLzPGnGNE",
    "https://www.youtube.com/watch?v=Vkw1eELgieU",
  ];

  return (
    <>
      <Swiper
        navigation={{
          nextEl: "#demovideos-swiper-button-next",
          prevEl: "#demovideos-swiper-button-prev",
        }}
        keyboard={true}
        freeMode={true}
        modules={[FreeMode, Navigation, Keyboard]}
        spaceBetween={70}
        slidesPerView={3}
        speed={600}
        grabCursor={true}
        className=" w-full border-[1px] border-orange-950"
      >
        <div>
          {arr.map((item, i) => (
            <SwiperSlide key={i}>
              <div
                className=" h-[342px] w-[414px] font-mulish border-[1px] border-orange-950 "
                onClick={() => showModal(item.split("=")[1])}
              >
                <div className=" relative border-[1px] border-orange-950 ">
                  <Image
                    src={`https://img.youtube.com/vi/${
                      item.split("=")[1]
                    }/maxresdefault.jpg`}
                    alt={`slide ${i + 1}`}
                    width={414}
                    height={260}
                    className="mx-auto"
                  />
                </div>

                <div>
                  <p className=" mt-[16px] text-fs18 leading-[1.27] tracking-wide">
                    {
                      "Завдання організації, особливо ж реалізація намічених планових завдань являє собою"
                    }
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>

        <ArrowsBlock
          className=" mt-[40px] ml-auto"
          idPrevButton={"demovideos-swiper-button-prev"}
          idNextButton={"demovideos-swiper-button-next"}
        />
      </Swiper>

      <ModalWindow onModalClose={onModalClose} showModal={modalState}>
        <iframe
          className="w-full h-[600px]"
          src={`https://www.youtube.com/embed/${currentVideo}`}
          frameBorder={0}
          allowFullScreen
        />
      </ModalWindow>
    </>
  );
}
