"use client";

import Image, { type StaticImageData } from "next/image";

import { FreeMode, Keyboard, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import ArrowsBlock from "@/shared/ui/ArrowsBlock";
import Container from "@/shared/ui/Container/Container";

import advantages1 from "@/public/advantages_1.png";
import advantages2 from "@/public/advantages_2.png";
import advantages3 from "@/public/advantages_3.png";
import advantages4 from "@/public/advantages_4.png";
import advantages5 from "@/public/advantages_5.png";

import "swiper/css";
import "swiper/css/keyboard";
import "swiper/css/free-mode";
import "swiper/css/navigation";

type AdvantageItem = {
  image: StaticImageData;
  title: string;
  text: string;
  imageClassName?: string;
};

const items: AdvantageItem[] = [
  {
    image: advantages1,
    title: "Різноманітність занять",
    text: "Різні комплекси, які містять в собі асани на розтяжку, силові асани, різні техніки дихання, медитативні елементи тощо. Вони розраховані на отримання результатів без одноманітності.",
  },
  {
    image: advantages2,
    title: "Індивідуальні заняття",
    text: "Підбір комплексу асан для конкретної особи за її потребами.",
  },
  {
    image: advantages3,
    title: "Проведення йогатерапії",
    text: "Має в собі елементи фізіотерапії та лікувальної гімнастики при невралгічних проблемах та при порушеннях опорно-рухового апарату.",
  },
  {
    image: advantages4,
    title: "Професійний підхід",
    text: "Заняття та комплекси асан підбираються з багатого досвіду інструктора на базі йога високопрофесійних знань підтверджених сертифікатами.",
  },
  {
    image: advantages5,
    title: "Проведення йогатурів",
    text: "Проводяться виїзні майстер-класи для різних комплексів та практик.",
  },
];

export default function AdvantageSection() {
  return (
    <section id="advantages" className="py-10 md:py-14">
      <Container className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-[#497274]">
            Наші переваги
          </p>
          <h2 className="font-philosopher text-[38px] font-bold leading-none text-localbrown md:text-[54px]">
            Різноманітність, досвід і підхід
          </h2>
        </div>

        <Swiper
          navigation={{
            nextEl: "#advantages-swiper-button-next",
            prevEl: "#advantages-swiper-button-prev",
          }}
          keyboard
          freeMode
          modules={[FreeMode, Navigation, Keyboard]}
          spaceBetween={24}
          slidesPerView={1}
          speed={600}
          grabCursor
          className="w-full"
          breakpoints={{
            708: { slidesPerView: 2, spaceBetween: 24 },
            1382: { slidesPerView: 3, spaceBetween: 24 },
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.title} className="h-auto">
              <article className="flex h-full flex-col bg-white px-5 py-6 md:px-6 md:py-7">
                <div className="mx-auto flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-full bg-[#f7f0ec]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={180}
                    height={180}
                    className="h-auto w-[180px]"
                  />
                </div>

                <div className="mt-6 space-y-4 text-center text-[#2c2c2c]">
                  <h3 className="text-[24px] font-semibold leading-tight text-[#497274]">
                    {item.title}
                  </h3>
                  <p className="text-[16px] leading-7">{item.text}</p>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <ArrowsBlock
          className="ml-auto"
          idPrevButton="advantages-swiper-button-prev"
          idNextButton="advantages-swiper-button-next"
        />
      </Container>
    </section>
  );
}
