"use client";

import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Keyboard, Navigation } from "swiper/modules";

import ArrowsBlock from "@/shared/ui/ArrowsBlock";
import { ModalWindow } from "@/shared/ui/ModalWindow/ModalWindow";
import { demoVideos, getVideoId } from "../model/demo-videos";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/keyboard";

export default function DemoVideosSlider() {
  const [modalState, setModalState] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");

  return (
    <>
      <Swiper
        navigation={{
          nextEl: "#demovideos-swiper-button-next",
          prevEl: "#demovideos-swiper-button-prev",
        }}
        keyboard
        freeMode
        modules={[FreeMode, Navigation, Keyboard]}
        spaceBetween={24}
        slidesPerView={1}
        speed={600}
        grabCursor
        className="w-full"
        breakpoints={{
          768: { slidesPerView: 2, spaceBetween: 24 },
          1280: { slidesPerView: 3, spaceBetween: 24 },
        }}
      >
        {demoVideos.map((item, index) => {
          const videoId = getVideoId(item.url);

          return (
            <SwiperSlide key={item.url}>
              <button
                type="button"
                className="flex h-full w-full flex-col overflow-hidden border border-[#dfbeaf] bg-white text-left"
                onClick={() => {
                  setCurrentVideo(videoId);
                  setModalState(true);
                }}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-white">
                  <Image
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm leading-6 text-[#4f2a26]">
                    {item.description}
                  </p>
                </div>
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="mt-6 ml-auto w-fit">
        <ArrowsBlock
          idPrevButton="demovideos-swiper-button-prev"
          idNextButton="demovideos-swiper-button-next"
        />
      </div>

      <ModalWindow onModalClose={() => setModalState(false)} showModal={modalState}>
        <iframe
          className="h-[600px] w-full"
          src={`https://www.youtube.com/embed/${currentVideo}`}
          title="Demo video"
          allowFullScreen
        />
      </ModalWindow>
    </>
  );
}
