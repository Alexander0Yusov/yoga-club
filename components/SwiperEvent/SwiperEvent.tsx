"use client";

import { useEffect, useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
  Keyboard,
} from "swiper/modules";

import "swiper/css";
// import "swiper/css/a11y";
import "swiper/css/autoplay";
// import "swiper/css/controller";
// import "swiper/css/effect-cards";
import "swiper/css/effect-coverflow";
// import "swiper/css/effect-creative";
// import "swiper/css/effect-cube";
// import "swiper/css/effect-fade";
// import "swiper/css/effect-flip";
// import "swiper/css/free-mode";
// import "swiper/css/grid";
// import "swiper/css/hash-navigation";
// import "swiper/css/history";
import "swiper/css/keyboard";
// import "swiper/css/manipulation";
// import "swiper/css/mousewheel";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import "swiper/css/parallax";
// import "swiper/css/scrollbar";
// import "swiper/css/thumbs";
// import "swiper/css/virtual";
// import "swiper/css/zoom";

import Image from "next/image";
import Arrow from "../0_ui/Arrow";

const SwiperEvent: any = ({
  pictures,
}: {
  pictures: { id: string; value: string }[];
}) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender) isFirstRender.current = false;
    if (!isFirstRender) {
      // найдены для добавления стилей
      const buttonPrev = document.querySelector(".swiper-button-prev");
      const buttonNext = document.querySelector(".swiper-button-next");
    }
  }, [isFirstRender]);

  return (
    <Swiper
      className=" w-full border-[1px] border-blue "
      // width={100}
      // height={100}
      // onSlideChange={() => console.log("slide change")}
      // onSwiper={(swiper) => console.log(swiper)}
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
      // or true
      effect={"coverflow"}
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
      loop={pictures?.length > 3 ? true : false}
      // чтобы дальние кадры скрыть - сделать дисплей-нан, либо опасити-0
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
      // zoom={{
      //   maxRatio: 1.5,
      // }}
      // allowTouchMove={true}
    >
      <div className="">
        {pictures.map(({ id, value }: any, i: any) => (
          <SwiperSlide
            key={id}
            className=" bg-white border-[1px] border-orange-700"
          >
            <div className=" events relative w-full h-[420px] mx-auto border-[1px] border-orange-950">
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

      <div className=" flex justify-between items-center w-[258px] h-[40px] mx-auto mt-[50px] text-fs18 text-brown-light ">
        <button
          id="events-swiper-button-prev"
          className="h-full px-[16px] rounded-full border-[1px] border-brown-light-light disabled:text-brown-light-light disabled:bg-transparent"
        >
          <Arrow className=" rotate-180" />
        </button>

        <div id="events-swiper-pagination" className=" mx-auto text-center " />

        <button
          id="events-swiper-button-next"
          className="h-full px-[16px] rounded-full border-[1px] border-brown-light-light disabled:text-brown-light-light disabled:bg-transparent"
        >
          <Arrow />
        </button>
      </div>

      {/* If we need pagination */}
      {/* <div className="swiper-pagination"></div> */}

      {/* If we need navigation buttons */}
      {/* <div className="swiper-button-prev"></div> */}
      {/* <div className="swiper-button-next"></div> */}

      {/* If we need scrollbar */}
      {/* <div className="swiper-scrollbar"></div> */}
    </Swiper>
  );
};

export default SwiperEvent;
