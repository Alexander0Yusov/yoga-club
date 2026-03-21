"use client";

import React, { useEffect, useMemo, useState } from "react";

import { Autoplay, Controller, EffectCoverflow, EffectFade, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/controller";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-fade";
import "swiper/css/keyboard";

import "./styles.css";
import Arrow from "../0_ui/Arrow";

type FeedbackItem = {
  _id: string;
  authorName?: string;
  comment?: string;
  text?: string;
  rating?: number;
  date?: string;
};

type FeedbackSliderProps = {
  data?: FeedbackItem[];
};

export default function FeedbackSlider({ data }: FeedbackSliderProps) {
  const [firstSwiper, setFirstSwiper] = useState<unknown>(null);
  const [secondSwiper, setSecondSwiper] = useState<unknown>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(data || []);

  useEffect(() => {
    if (data && data.length > 0) {
      setFeedbacks(data);
      return;
    }

    const loadFeedbacks = async () => {
      const response = await fetch("/api/feedbacks");
      if (!response.ok) {
        return;
      }

      const result = (await response.json()) as FeedbackItem[];
      setFeedbacks(result);
    };

    void loadFeedbacks();
  }, [data]);

  const items = useMemo(() => feedbacks, [feedbacks]);

  return (
    <div>
      <Swiper
        onSwiper={setFirstSwiper as never}
        controller={{ control: secondSwiper as never }}
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
        keyboard={{
          enabled: true,
          onlyInViewport: false,
        }}
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
        slidesPerView={1}
        speed={1000}
        centeredSlides={true}
        grabCursor={true}
        lazyPreloadPrevNext={3}
        className="mySwiper mb-[20px]"
      >
        <div className="swiper-wrapper">
          {items.map((item) => (
            <SwiperSlide key={item._id}>
              <div className="flex flex-col justify-between rounded-[20px] border-[1px] border-lilac bg-white px-[45px] py-[20px]">
                <p className="mx-auto mb-[20px] text-fs24 text-cadetblue text-center">
                  {item.authorName || "Guest"}
                </p>
                <p className="h-[75px] overflow-x-hidden overflow-y-auto">
                  {item.comment || item.text || ""}
                </p>
                <p className="mt-auto text-[8px]">
                  {item.date ? new Date(item.date).toISOString() : ""}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>

      <Swiper
        onSwiper={setSecondSwiper as never}
        controller={{ control: firstSwiper as never }}
        slidesPerView={1}
        effect={"fade"}
        modules={[Controller, EffectFade]}
        spaceBetween={30}
        className="mySwiper2"
      >
        <div className="swiper-wrapper">
          {items.map((item) => (
            <SwiperSlide key={item._id} className="border-[1px] border-orange-950">
              <p className="mx-auto mb-[20px] text-center text-fs24 text-cadetblue">
                {item.authorName || "Guest"}
              </p>

              <div className="mx-auto flex h-[130px] w-[710px] flex-col justify-between rounded-[20px] border-[1px] border-lilac bg-white px-[45px] py-[20px]">
                <p className="h-[75px] overflow-x-hidden overflow-y-auto">
                  {item.comment || item.text || ""}
                </p>
                <p className="mt-auto text-[8px]">{item.date || ""}</p>
              </div>
            </SwiperSlide>
          ))}
        </div>

        <div className="mx-auto mt-[110px] flex h-[40px] w-[258px] items-center justify-between text-fs18 text-brown-light">
          <button
            id="feedbacks-swiper-button-prev"
            className="h-full rounded-full border-[1px] border-brown-light-light px-[16px] disabled:bg-transparent disabled:text-brown-light-light"
          >
            <Arrow className="rotate-180" />
          </button>

          <div id="feedbacks-swiper-pagination" className="mx-auto text-center" />

          <button
            id="feedbacks-swiper-button-next"
            className="h-full rounded-full border-[1px] border-brown-light-light px-[16px] disabled:bg-transparent disabled:text-brown-light-light"
          >
            <Arrow />
          </button>
        </div>
      </Swiper>
    </div>
  );
}
