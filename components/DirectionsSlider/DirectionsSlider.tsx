"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Keyboard } from "swiper/modules";

import { directions_lib } from "@/lib/dataDirections";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";
import "swiper/css/keyboard";
import "swiper/css/pagination";

// import "./styles.css";

export default function DirectionsSlider() {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<any>(0);

  const handleWordClick = (index: any) => {
    thumbsSwiper.slideTo(index);
  };

  return (
    <>
      <div className=" words-pagination flex justify-between mb-[50px] text-fs24 text-cadetblue">
        {directions_lib.map((item, index) => (
          <button
            key={index}
            className={`word-pagination ${
              index === activeIndex ? " font-bold underline " : ""
            }`}
            onClick={() => handleWordClick(index)}
          >
            {item.text.title}
          </button>
        ))}
      </div>

      <Swiper
        navigation={false}
        slidesPerView={1}
        spaceBetween={50}
        keyboard={true}
        effect={"fade"}
        modules={[EffectFade, Keyboard]}
        speed={600}
        grabCursor={true}
        onSwiper={(swiper) => setThumbsSwiper(swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className=" border-[1px] border-orange-950"
      >
        {directions_lib.map((item, i) => (
          <SwiperSlide key={i} className=" h-[480px] ">
            <div className="flex justify-between bg-white">
              <div className=" relative w-[683px]">
                <Image
                  src={item.slide.src}
                  alt={item.slide.alt}
                  style={{ height: "100%", width: "auto" }}
                />
              </div>

              <div className=" w-[627px] font-mulish text-fs18 leading-[1.3]">
                {item.text.desc.map((paragraph, i) => (
                  <p key={i} className="mb-[10px]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
