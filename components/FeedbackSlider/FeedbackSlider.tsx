"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

import { Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/keyboard";

import "./styles.css";
import Arrow from "../0_ui/Arrow";
import { ModalWindow } from "../0_ui/ModalWindow/ModalWindow";

type FeedbackItem = {
  _id: string;
  authorName?: string;
  avatarUrl?: string;
  comment?: string;
  text?: string;
  rating?: number;
  date?: string;
};

type FeedbackSliderProps = {
  data?: FeedbackItem[];
};

const avatarTones = [
  "bg-[#d9d9d9]",
  "bg-[#d0d7d2]",
  "bg-[#d9cec8]",
  "bg-[#d5dddd]",
  "bg-[#e0d7cf]",
];

function getInitials(name?: string) {
  const normalized = (name || "Guest").trim();
  const parts = normalized.split(/\s+/).filter(Boolean);
  const initials =
    parts.length > 1
      ? `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`
      : normalized.slice(0, 2);

  return initials.toUpperCase();
}

function getTone(name?: string) {
  const value = (name || "Guest")
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return avatarTones[value % avatarTones.length];
}

function formatIsoDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function Avatar({
  avatarUrl,
  authorName,
  active,
}: {
  avatarUrl?: string;
  authorName?: string;
  active?: boolean;
}) {
  const initials = getInitials(authorName);
  const sizeClass = active ? "scale-[1.18]" : "scale-100";

  if (avatarUrl) {
    return (
      <div
        className={`relative h-[128px] w-[128px] overflow-hidden rounded-full border border-[#e4d6cf] bg-[#f4efec] transition-transform duration-500 ${sizeClass}`}
      >
        <Image
          src={avatarUrl}
          alt={`${authorName || "Guest"} avatar`}
          fill
          sizes="128px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex h-[128px] w-[128px] items-center justify-center rounded-full text-[#8f8f8f] transition-transform duration-500 ${getTone(
        authorName
      )} ${sizeClass}`}
      aria-label={`${authorName || "Guest"} avatar placeholder`}
    >
      {initials}
    </div>
  );
}

export default function FeedbackSlider({ data }: FeedbackSliderProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(data || []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<{
    slidePrev?: () => void;
    slideNext?: () => void;
    slideToLoop?: (index: number) => void;
    autoplay?: { stop?: () => void };
  } | null>(null);
  const [showTextModal, setShowTextModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setFeedbacks(data);
      return;
    }

    const loadFeedbacks = async () => {
      const response = await fetch("/api/feedbacks");

      if (!response.ok) {
        setFeedbacks([]);
        return;
      }

      const result = (await response.json()) as FeedbackItem[];
      setFeedbacks(result);
    };

    void loadFeedbacks();
  }, [data]);

  const items = useMemo(() => feedbacks, [feedbacks]);
  const activeItem = items[activeIndex] || items[0];

  if (items.length === 0) {
    return null;
  }

  const stopAutoplay = () => {
    swiper?.autoplay?.stop?.();
  };

  const slidePrev = () => {
    stopAutoplay();

    if (typeof swiper?.slidePrev === "function") {
      swiper.slidePrev();
    }
  };

  const slideNext = () => {
    stopAutoplay();

    if (typeof swiper?.slideNext === "function") {
      swiper.slideNext();
    }
  };

  const openTextModal = (item: FeedbackItem) => {
    setSelectedItem(item);
    setShowTextModal(true);
  };

  return (
    <div className="w-full overflow-x-clip">
      <Swiper
        onSwiper={setSwiper as never}
        onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
        onTouchStart={stopAutoplay}
        modules={[Autoplay, Keyboard]}
        autoplay={{
          delay: 4500,
          disableOnInteraction: true,
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: false,
        }}
        speed={900}
        loop={items.length > 1}
        centeredSlides={true}
        slideToClickedSlide={true}
        slidesPerView="auto"
        spaceBetween={24}
        className="feedback-slider__avatars mx-auto mb-6 w-full"
      >
        {items.map((item, index) => (
          <SwiperSlide key={item._id} className="feedback-slider__avatar-slide">
            <button
              type="button"
              onClick={() =>
                typeof swiper?.slideToLoop === "function"
                  ? swiper.slideToLoop(index)
                  : setActiveIndex(index)
              }
              className="flex items-center justify-center"
              aria-label={`Select review by ${item.authorName || "Guest"}`}
            >
              <Avatar
                avatarUrl={item.avatarUrl}
                authorName={item.authorName}
                active={index === activeIndex}
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mx-auto flex w-full max-w-[620px] flex-col items-center px-3">
        <h3 className="mb-4 text-center text-[28px] font-semibold leading-none text-cadetblue transition-all duration-300 md:text-[34px]">
          {activeItem?.authorName || "Guest"}
        </h3>

        <div className="flex h-[176px] w-full flex-col rounded-[18px] border border-[#d9c9c2] bg-white px-6 py-5 text-center shadow-[0_1px_0_rgba(0,0,0,0.02)] md:px-10 md:py-7">
          <div className="flex-1">
            <p className="feedback-slider__excerpt text-[15px] leading-[1.45] text-[#2c2c2c] md:text-[17px]">
              {activeItem?.comment || activeItem?.text || ""}
            </p>
            {((activeItem?.comment || activeItem?.text || "").length > 140) && (
              <button
                type="button"
                onClick={() => {
                  if (activeItem) {
                    openTextModal(activeItem);
                  }
                }}
                className="mt-2 inline-flex items-center justify-center rounded-full px-2 py-1 text-[18px] leading-none text-[#d18a68] transition hover:bg-[#fff7f1] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d18a68]/40"
                aria-label="Open full review text"
              >
                ...
              </button>
            )}
          </div>

          <p className="mt-auto text-[8px]">
            {activeItem?.date ? formatIsoDate(activeItem.date) : ""}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-5 text-[#d18a68]">
          <button
            type="button"
            onClick={slidePrev}
            className="flex h-11 w-16 items-center justify-center rounded-full border border-[#efc3a9] bg-transparent transition-colors hover:bg-[#fff7f1]"
            aria-label="Previous review"
          >
            <Arrow className="rotate-180" />
          </button>

          <span className="min-w-[72px] text-center text-[16px] font-medium">
            {activeIndex + 1} / {items.length}
          </span>

          <button
            type="button"
            onClick={slideNext}
            className="flex h-11 w-16 items-center justify-center rounded-full border border-[#efc3a9] bg-transparent transition-colors hover:bg-[#fff7f1]"
            aria-label="Next review"
          >
            <Arrow />
          </button>
        </div>
      </div>

      <ModalWindow
        onModalClose={() => setShowTextModal(false)}
        showModal={showTextModal}
        className="max-w-[760px]"
      >
        <div className="space-y-4 text-center">
          <h4 className="text-[28px] font-semibold text-cadetblue">
            {selectedItem?.authorName || "Guest"}
          </h4>
          <p className="whitespace-pre-wrap text-left text-[16px] leading-7 text-[#2c2c2c]">
            {selectedItem?.comment || selectedItem?.text || ""}
          </p>
        </div>
      </ModalWindow>
    </div>
  );
}
