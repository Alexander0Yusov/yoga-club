"use client";

import { useEffect, useMemo, useState } from "react";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

type FeedbackItem = {
  _id?: string;
  authorName?: string;
  comment?: string;
  text?: string;
  rating?: number;
  date?: string;
  isActive?: boolean;
  deletedAt?: string | null;
};

const fallbackFeedbacks: FeedbackItem[] = [
  {
    _id: "mock-1",
    authorName: "Alina",
    comment: "Warm class structure and clear pacing. The studio felt calm from the first minute.",
    rating: 5,
    date: "2026-03-01T10:00:00Z",
    isActive: true,
    deletedAt: null,
  },
  {
    _id: "mock-2",
    authorName: "Ira",
    comment: "Booking was easy and the feedback module stayed readable on mobile.",
    rating: 4,
    date: "2026-03-08T10:00:00Z",
    isActive: true,
    deletedAt: null,
  },
];

function formatIsoDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function FeedbackSlider() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    const loadFeedbacks = async () => {
      const response = await fetch("/api/feedbacks");
      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as FeedbackItem[];
      setFeedbacks(data);
    };

    void loadFeedbacks();
  }, []);

  const items = useMemo(() => {
    return feedbacks.length > 0 ? feedbacks : fallbackFeedbacks;
  }, [feedbacks]);

  return (
    <div className="overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4500,
          disableOnInteraction: true,
        }}
        pagination={{
          clickable: true,
        }}
        loop={items.length > 1}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 1.2,
          },
          1024: {
            slidesPerView: 1.5,
          },
        }}
        className="pb-10"
      >
        {items.map((item) => (
          <SwiperSlide key={item._id || item.authorName}>
            <article className="h-full rounded-[28px] border border-[#dfbeaf] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#497274]">
                    Feedback
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#81453e]">
                    {item.authorName || "Guest"}
                  </h3>
                  <p className="mt-1 text-sm text-[#c57665]">
                    Rating: {item.rating || 5}/5
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#dfbeaf] to-[#c57665] text-sm font-semibold text-white">
                  {(item.authorName || "G").slice(0, 1).toUpperCase()}
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-[#4f2a26]">
                {item.comment || item.text || ""}
              </p>

              <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[#497274]">
                {formatIsoDate(item.date || new Date().toISOString())}
              </p>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
