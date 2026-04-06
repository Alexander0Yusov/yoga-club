"use client";

import Image, { type StaticImageData } from "next/image";

import { Navigation, EffectFade, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import ArrowsBlock from "@/shared/ui/ArrowsBlock";
import Container from "@/shared/ui/Container/Container";

import about1_2 from "@/public/about_1_2.jpg";
import about2_1 from "@/public/about_2_1.jpg";
import about2_2 from "@/public/about_2_2.jpg";
import about3_1 from "@/public/about_3_1.jpg";
import about3_2 from "@/public/about_3_2.jpg";
import about4_1 from "@/public/about_4_1.jpg";
import about4_2 from "@/public/about_4_2.jpg";
import about5_1 from "@/public/about_5_1.jpg";
import about5_2 from "@/public/about_5_2.jpg";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/keyboard";

type AboutSlide = {
  slide_1: { src: StaticImageData; alt: string } | null;
  slide_2: { src: StaticImageData; alt: string };
};

const textSlide = {
  title: "Надія Корабльова",
  paragraph_1: "Сертифікована інструкторка з йоги та фізіотерапевтичних практик.",
  paragraph_2:
    "Авторка власних методик по роботі з фізичним і енергетичним тілом. Провожу в тонкий світ через медитації, роботу з силою волі і пранаями.",
  paragraph_3:
    "Як фізіотерапевт складаю індивідуальні комплекси для усунення болю при грижі, протрузії, сколіозі, спондилоартрозах тощо.",
  paragraph_4:
    "Проводжу майстер-класи зі спортивного і йогівського напрямків.",
};

const slides: AboutSlide[] = [
  {
    slide_1: null,
    slide_2: {
      src: about1_2,
      alt: "extreme position",
    },
  },
  {
    slide_1: {
      src: about2_1,
      alt: "extreme position",
    },
    slide_2: {
      src: about2_2,
      alt: "bachelors diploma",
    },
  },
  {
    slide_1: {
      src: about3_1,
      alt: "certificate",
    },
    slide_2: {
      src: about3_2,
      alt: "extreme position",
    },
  },
  {
    slide_1: {
      src: about4_1,
      alt: "extreme position",
    },
    slide_2: {
      src: about4_2,
      alt: "certificate",
    },
  },
  {
    slide_1: {
      src: about5_1,
      alt: "certificate",
    },
    slide_2: {
      src: about5_2,
      alt: "extreme position",
    },
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-10 md:py-14">
      <Container className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-[#497274]">
            Про мене
          </p>
          <h2 className="font-philosopher text-[38px] font-bold leading-none text-localbrown md:text-[54px]">
            Авторська практика та досвід
          </h2>
        </div>

        <Swiper
          navigation={{
            nextEl: "#about-swiper-button-next",
            prevEl: "#about-swiper-button-prev",
          }}
          keyboard
          effect="fade"
          modules={[EffectFade, Navigation, Keyboard]}
          spaceBetween={35}
          slidesPerView={1}
          speed={600}
          centeredSlides
          grabCursor
          className="overflow-hidden border border-[#dfbeaf] bg-white"
        >
          {slides.map((item, i) => (
            <SwiperSlide key={i} className="overflow-hidden">
              <div className="grid min-h-[480px] overflow-hidden bg-white lg:grid-cols-2">
                <div className="relative min-h-[260px] overflow-hidden bg-white lg:min-h-[480px]">
                  {!item.slide_1 ? (
                    <div className="flex h-full items-center px-4 py-5 text-[16px] leading-[1.3] text-[#2c2c2c] md:px-6 md:text-[18px] lg:px-8">
                      <div className="w-full lg:w-[627px]">
                        <p className="mb-[20px] font-bold text-[24px] text-[#81453e]">
                          {textSlide.title}
                        </p>
                        <p className="mb-[10px]">{textSlide.paragraph_1}</p>
                        <p className="mb-[10px]">{textSlide.paragraph_2}</p>
                        <p className="mb-[10px]">{textSlide.paragraph_3}</p>
                        <p>{textSlide.paragraph_4}</p>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={item.slide_1.src}
                      alt={item.slide_1.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 683px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="relative min-h-[260px] overflow-hidden bg-white lg:min-h-[480px]">
                  <Image
                    src={item.slide_2.src}
                    alt={item.slide_2.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 683px"
                    className="object-cover"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}

          <ArrowsBlock
            className="mt-[40px] ml-auto"
            idPrevButton="about-swiper-button-prev"
            idNextButton="about-swiper-button-next"
          />
        </Swiper>
      </Container>
    </section>
  );
}
