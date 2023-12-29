"use client";
import { useEffect, useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
  EffectCoverflow,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/a11y";
import "swiper/css/autoplay";
import "swiper/css/controller";
import "swiper/css/effect-cards";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-creative";
import "swiper/css/effect-cube";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";
import "swiper/css/free-mode";
import "swiper/css/grid";
import "swiper/css/hash-navigation";
import "swiper/css/history";
import "swiper/css/keyboard";
import "swiper/css/manipulation";
import "swiper/css/mousewheel";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/parallax";
import "swiper/css/scrollbar";
import "swiper/css/thumbs";
import "swiper/css/virtual";
import "swiper/css/zoom";
import Image from "next/image";

const SwiperEvent: any = ({
  pictures,
}: {
  pictures: { id: string; value: string }[];
}) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender) isFirstRender.current = false;
    if (!isFirstRender) {
      // для добавления стилей найдены
      const buttonPrev = document.querySelector(".swiper-button-prev");
      const buttonNext = document.querySelector(".swiper-button-next");
    }
  }, [isFirstRender]);

  return (
    <Swiper
      // width={100}
      // height={100}
      // spaceBetween={50}
      slidesPerView={1}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}
      pagination={{
        enabled: true,
        clickable: true,
        type: "bullets",
      }}
      speed={1500}
      // breakpoints={{
      //   // when window width is >= 320px
      //   320: {
      //     slidesPerView: 2,
      //     spaceBetween: 20,
      //   },
      //   // when window width is >= 480px
      //   480: {
      //     slidesPerView: 3,
      //     spaceBetween: 30,
      //   },
      //   // when window width is >= 640px
      //   640: {
      //     slidesPerView: 4,
      //     spaceBetween: 40,
      //   },
      // }}
      keyboard={{
        enabled: true,
        onlyInViewport: false,
      }}
      zoom={{
        maxRatio: 1.5,
      }}
      //
      id={"22"}
      modules={[Autoplay, Pagination, EffectFade, EffectCoverflow, Navigation]}
      allowTouchMove={true}
      grabCursor={true}
      effect={false ? "fade" : "coverflow"}
      // autoplay={{ disableOnInteraction: false, delay: 20000 }}
      loop={true}
      lazyPreloadPrevNext={1}
    >
      <div className="swiper-wrapper">
        {pictures?.map(({ id, value }: any, i) => (
          <SwiperSlide key={id}>
            <div
              id="thumb"
              className="relative w-[800px] h-[600px] mx-auto border-[1px] border-orange-950"
            >
              <Image
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw"
                style={{ objectFit: "contain" }}
                src={value}
                alt={`event picture number ${i}`}
              />
            </div>
          </SwiperSlide>
        ))}
      </div>
      {/* If we need pagination */}
      <div className="swiper-pagination"></div>

      {/* If we need navigation buttons */}
      <div className="swiper-button-prev"></div>
      <div className="swiper-button-next"></div>

      {/* If we need scrollbar */}
      <div className="swiper-scrollbar"></div>
    </Swiper>
  );
};

export default SwiperEvent;
