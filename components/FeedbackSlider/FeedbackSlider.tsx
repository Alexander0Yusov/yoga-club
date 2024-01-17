"use client";

import React, { useEffect, useState } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import {
  Pagination,
  Navigation,
  EffectFade,
  Keyboard,
  EffectCoverflow,
  Autoplay,
  Controller,
} from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/controller";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-fade";
import "swiper/css/keyboard";

import "./styles.css";
import Image from "next/image";
import Arrow from "../0_ui/Arrow";

export default function FeedbackSlider({ data }: { data: any }) {
  const [firstSwiper, setFirstSwiper] = useState(null);
  const [secondSwiper, setSecondSwiper] = useState(null);
  const [feedbacks, setFeedbacks] = useState<any>([]);

  useEffect(() => {
    fetch("/api/feedbacks")
      .then((res) => res.json())
      .then((res) => {
        setFeedbacks(res);
        console.log(res);
      });
  }, []);

  return (
    <div className="  ">
      <Swiper
        onSwiper={setFirstSwiper as any}
        controller={{ control: secondSwiper }}
        pagination={{
          type: "fraction",
          clickable: true,
          el: "#feedbacks-swiper-pagination",
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: true,
        }}
        navigation={{
          prevEl: "#feedbacks-swiper-button-prev",
          nextEl: "#feedbacks-swiper-button-next",
        }}
        keyboard={true}
        effect={"coverflow"}
        coverflowEffect={{
          rotate: 1,
          stretch: 0,
          scale: 0.9,
          depth: 0,
          modifier: 1,
          slideShadows: false,
        }}
        modules={[
          Controller,
          Autoplay,
          EffectCoverflow,
          Pagination,
          Navigation,
          Keyboard,
        ]}
        // spaceBetween={35}
        slidesPerView={7}
        speed={1000}
        centeredSlides={true}
        grabCursor={true}
        className="mySwiper mb-[20px]"
      >
        <div className="swiper-wrapper">
          {feedbacks.map((item: any) => (
            <SwiperSlide key={item._id} className="">
              <div className=" relative w-[200px] h-[200px] rounded-full overflow-hidden">
                <Image
                  src={item?.ownerInfo?.portrait || item?.owner?.image}
                  alt={"client portrait"}
                  width={200}
                  height={200}
                />
              </div>
            </SwiperSlide>
          ))}
        </div>

        {/* If we need scrollbar */}
        {/* <div className="swiper-scrollbar"></div> */}
      </Swiper>

      <Swiper
        onSwiper={setSecondSwiper as any}
        controller={{ control: firstSwiper }}
        slidesPerView={1}
        effect={"fade"}
        modules={[Controller, EffectFade]}
        spaceBetween={30}
        className="mySwiper2"
      >
        <div className="swiper-wrapper">
          {feedbacks.map((item: any) => (
            <SwiperSlide
              key={item._id}
              className="border-[1px] border-orange-950"
            >
              <p className="mx-auto mb-[20px] text-fs24 text-cadetblue text-center">
                {item.ownerInfo.nickname || item.owner.name}
              </p>

              <div className="flex flex-col justify-between w-[710px] h-[120px] px-[45px] py-[20px] mx-auto bg-white rounded-[20px] border-[1px] border-lilac">
                <p>{item.text}</p>
                <p className=" text-[8px] ">{item.updatedAt}</p>
              </div>
            </SwiperSlide>
          ))}
        </div>

        <div className=" flex justify-between items-center w-[258px] h-[40px] mx-auto mt-[110px] text-fs18 text-brown-light ">
          <button
            id="feedbacks-swiper-button-prev"
            className="h-full px-[16px] rounded-full border-[1px] border-brown-light-light disabled:text-brown-light-light disabled:bg-transparent"
          >
            <Arrow className=" rotate-180" />
          </button>

          <div
            id="feedbacks-swiper-pagination"
            className=" mx-auto text-center "
          />

          <button
            id="feedbacks-swiper-button-next"
            className="h-full px-[16px] rounded-full border-[1px] border-brown-light-light disabled:text-brown-light-light disabled:bg-transparent"
          >
            <Arrow />
          </button>
        </div>
      </Swiper>
    </div>
  );
}
