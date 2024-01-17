"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Keyboard } from "swiper/modules";

import { images_about_lib as data, textSlide_1 } from "@/lib/imagesAbout";

import ArrowsBlock from "../ArrowsBlock/ArrowsBlock";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/keyboard";

// import "./styles.css";

export default function AboutSlider() {
  return (
    <Swiper
      navigation={{
        prevEl: "#about-swiper-button-prev",
        nextEl: "#about-swiper-button-next",
      }}
      keyboard={true}
      effect={"fade"}
      modules={[EffectFade, Navigation, Keyboard]}
      spaceBetween={35}
      slidesPerView={1}
      speed={600}
      centeredSlides={true}
      grabCursor={true}
      className=" border-[1px] border-orange-950"
    >
      <div className="about-swiper-wrapper">
        {data.map((item, i) => (
          <SwiperSlide key={i} className=" h-[480px] ">
            <div className="flex justify-between">
              <div className=" relative w-[683px]">
                {!item.slide_1 && (
                  <div className=" w-[627px] font-mulish text-fs18 leading-[1.3]">
                    <p className=" mt-[120px] mb-[20px] font-bold text-fs24 text-brown-light">
                      {textSlide_1.title}
                    </p>
                    <p className="mb-[10px]">{textSlide_1.paragraph_1}</p>
                    <p className="mb-[10px]">{textSlide_1.paragraph_2}</p>
                    <p className="mb-[10px]">{textSlide_1.paragraph_3}</p>
                    <p>{textSlide_1.paragraph_4}</p>
                  </div>
                )}

                {item.slide_1 && (
                  <Image
                    src={item.slide_1.src}
                    alt={item.slide_1.alt}
                    style={{ height: "100%", width: "auto" }}
                  />
                )}
              </div>

              <div className=" relative w-[683px]">
                <Image
                  src={item.slide_2.src}
                  alt={item.slide_2.alt}
                  style={{ height: "100%", width: "auto" }}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </div>

      <ArrowsBlock
        className=" mt-[40px] ml-auto"
        idPrevButton={"about-swiper-button-prev"}
        idNextButton={"about-swiper-button-next"}
      />
    </Swiper>
  );
}
