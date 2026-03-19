"use client";

import { useMemo } from "react";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

type FeedbackItem = {
  id: string;
  name: string;
  text: string;
  date: string;
  role?: string;
};

const fallbackFeedbacks: FeedbackItem[] = [
  {
    id: "mock-1",
    name: "Alina",
    text: "Очень мягкая атмосфера и понятная подача. Хотелось бы вернуться снова.",
    date: "2026-03-01T10:00:00Z",
    role: "Guest",
  },
  {
    id: "mock-2",
    name: "Ira",
    text: "Слайдер выглядит живым даже без backend-данных, а отзывы легко читаются на мобилке.",
    date: "2026-03-08T10:00:00Z",
    role: "Member",
  },
  {
    id: "mock-3",
    name: "Nadia",
    text: "Хорошо, что блок отзывов остался отдельным и не привязан к конкретному событию.",
    date: "2026-03-12T10:00:00Z",
    role: "Visitor",
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

export default function FeedbackSlider({
  feedbacks,
}: {
  feedbacks?: FeedbackItem[];
}) {
  const items = useMemo(() => {
    return feedbacks && feedbacks.length > 0 ? feedbacks : fallbackFeedbacks;
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
          <SwiperSlide key={item.id}>
            <article className="h-full rounded-[28px] border border-[#dfbeaf] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#497274]">
                    Feedback
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#81453e]">
                    {item.name}
                  </h3>
                  {item.role ? (
                    <p className="mt-1 text-sm text-[#c57665]">{item.role}</p>
                  ) : null}
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#dfbeaf] to-[#c57665] text-sm font-semibold text-white">
                  {item.name.slice(0, 1).toUpperCase()}
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-[#4f2a26]">
                {item.text}
              </p>

              <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[#497274]">
                {formatIsoDate(item.date)}
              </p>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
