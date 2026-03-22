"use client";

import { useEffect, useRef } from "react";

import Image, { type StaticImageData } from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
  Keyboard,
} from "swiper/modules";

import Arrow from "@/shared/ui/Arrow";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import "swiper/css/keyboard";
import "swiper/css/navigation";
import "swiper/css/pagination";

type SwiperEventProps = {
  pictures: { id: string; value: string | StaticImageData }[];
};

const SwiperEvent = ({ pictures }: SwiperEventProps) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) isFirstRender.current = false;
    if (!isFirstRender.current) {
      const buttonPrev = document.querySelector(".swiper-button-prev");
      const buttonNext = document.querySelector(".swiper-button-next");

      return () => {
        void buttonPrev;
        void buttonNext;
      };
    }
    return undefined;
  }, []);

  return (
    <Swiper
      className="w-full border-[1px] border-blue"
      pagination={{
        type: "fraction",
        clickable: true,
        el: "#events-swiper-pagination",
      }}
      autoplay={{
        delay: 4000,
        disableOnInteraction: true,
      }}
      navigation={{
        nextEl: "#events-swiper-button-next",
        prevEl: "#events-swiper-button-prev",
      }}
      keyboard={{
        enabled: true,
        onlyInViewport: true,
      }}
      effect="coverflow"
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        scale: 1,
        depth: 550,
        modifier: 1,
        slideShadows: false,
      }}
      modules={[Autoplay, Pagination, EffectCoverflow, Navigation, Keyboard]}
      spaceBetween={190}
      slidesPerView={2}
      speed={1200}
      centeredSlides={true}
      grabCursor={true}
      lazyPreloadPrevNext={1}
      loop={pictures.length > 3}
    >
      <div>
        {pictures.map(({ id, value }, i) => (
          <SwiperSlide
            key={id}
            className="border-[1px] border-orange-700 bg-white"
          >
            <div className="events relative mx-auto h-[420px] w-full border-[1px] border-orange-950">
              <Image
                src={value}
                alt={`event picture number ${i}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw"
                className="object-contain object-center"
              />
            </div>
          </SwiperSlide>
        ))}
      </div>

      <div className="mx-auto mt-[50px] flex h-[40px] w-[258px] items-center justify-between text-fs18 text-brown-light">
        <button
          id="events-swiper-button-prev"
          className="h-full rounded-full border-[1px] border-brown-light-light px-[16px] disabled:bg-transparent disabled:text-brown-light-light"
        >
          <Arrow className="rotate-180" />
        </button>

        <div id="events-swiper-pagination" className="mx-auto text-center" />

        <button
          id="events-swiper-button-next"
          className="h-full rounded-full border-[1px] border-brown-light-light px-[16px] disabled:bg-transparent disabled:text-brown-light-light"
        >
          <Arrow />
        </button>
      </div>
    </Swiper>
  );
};

export default SwiperEvent;
