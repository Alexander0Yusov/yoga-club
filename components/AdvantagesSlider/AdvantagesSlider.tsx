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

// import "./styles.css";

export default function AdvantagesSlider() {
  return (
    <Swiper
      navigation={{
        nextEl: "#advantages-swiper-button-next",
        prevEl: "#advantages-swiper-button-prev",
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
        {advantages_lib.map((item, i) => (
          <SwiperSlide key={i}>
            <div className=" h-[491px] w-[414px] font-mulish border-[1px] border-orange-950 ">
              <div className=" relative w-[300px] h-[300px] mx-auto p-[50px] rounded-full bg-brown-light-light border-[1px] border-orange-950 ">
                <Image
                  src={item.slide.src}
                  alt={item.slide.alt}
                  style={{
                    width: "auto",
                    height: "100%",
                  }}
                  className="mx-auto"
                />
              </div>

              <div>
                <p className=" mt-[30px] text-fs24 text-cadetblue">
                  {item.text.title}
                </p>

                <p className=" mt-[16px] text-fs18 leading-[1.27] tracking-wide">
                  {item.text.desc}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </div>

      <ArrowsBlock
        className=" mt-[40px] ml-auto"
        idPrevButton={"advantages-swiper-button-prev"}
        idNextButton={"advantages-swiper-button-next"}
      />
    </Swiper>
  );
}
