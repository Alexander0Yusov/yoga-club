"use client";

import Image, { type StaticImageData } from "next/image";
import { useMemo } from "react";
import { Autoplay, EffectCoverflow, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Arrow from "@/shared/ui/Arrow";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import "swiper/css/keyboard";
import "swiper/css/navigation";
import "swiper/css/pagination";

type SwiperEventProps = {
  pictures: { id: string; value: string | StaticImageData; alt?: string }[];
};

const SwiperEvent = ({ pictures }: SwiperEventProps) => {
  const visiblePictures = useMemo(() => {
    if (pictures.length === 1) {
      return [pictures[0], pictures[0], pictures[0]];
    }

    if (pictures.length === 2) {
      return [...pictures, pictures[0]];
    }

    return pictures;
  }, [pictures]);

  return (
    <div className="space-y-4">
      <Swiper
        className="w-full"
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
        spaceBetween={48}
        slidesPerView={1.08}
        breakpoints={{
          1024: {
            slidesPerView: 1.15,
            spaceBetween: 64,
          },
        }}
        speed={900}
        centeredSlides
        grabCursor
        lazyPreloadPrevNext={1}
        loop={visiblePictures.length > 3}
      >
        {visiblePictures.map(({ id, value, alt }, index) => (
          <SwiperSlide key={id} className="bg-white">
            <div className="relative aspect-[1160/420] w-full overflow-hidden bg-white">
              <Image
                src={value}
                alt={alt || `event picture number ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1160px"
                className="object-cover object-center"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mx-auto flex h-[40px] w-[258px] items-center justify-between text-fs18 text-brown-light">
        <button
          id="events-swiper-button-prev"
          className="h-full rounded-full border border-brown-light-light px-[16px] disabled:bg-transparent disabled:text-brown-light-light"
          type="button"
        >
          <Arrow className="rotate-180" />
        </button>

        <div id="events-swiper-pagination" className="mx-auto text-center" />

        <button
          id="events-swiper-button-next"
          className="h-full rounded-full border border-brown-light-light px-[16px] disabled:bg-transparent disabled:text-brown-light-light"
          type="button"
        >
          <Arrow />
        </button>
      </div>
    </div>
  );
};

export default SwiperEvent;
