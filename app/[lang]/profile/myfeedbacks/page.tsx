import Image from "next/image";

import noContentImage from "@/public/no-content.jpg";
import Container from "@/components/0_ui/Container/Container";
import Section from "@/components/0_ui/Section/Section";
import MyFeedbacksGallery from "@/components/MyFeedbacksGallery/MyFeedbacksGallery";

const MyFeedbacksPage = () => {
  //  здесь надо делать запрос отзывов и передавать в галерею

  return (
    <Section id="myFeedback" className="pt-[40px] pb-[100px]">
      {true ? (
        <MyFeedbacksGallery />
      ) : (
        <>
          <div className="relative w-[400px] h-[400px] mx-auto mb-[40px] overflow-hidden border-[1px] border-orange-950">
            <Image
              src={noContentImage}
              alt="meditating woman"
              width={400}
              height={400}
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 17vw"
              className="h-full w-full object-cover object-center"
            />
          </div>

          <p className=" text-center font-bold text-fs24">
            Чекаємо на Ваш відгук
          </p>
        </>
      )}
    </Section>
  );
};

export default MyFeedbacksPage;
