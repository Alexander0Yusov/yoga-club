import React from "react";
import Section from "@/components/0_ui/Section/Section";
import ButtonOpenFormFeedback from "@/components/ButtonOpenFormFeedback/ButtonOpenFormFeedback";
import FeedbackSlider from "@/components/FeedbackSlider/FeedbackSlider";

const SectionFeedbacks = async () => {
  const getFeedbacks = await import("../../app/api/feedbacks/route");

  const feedbacks = await (await getFeedbacks.GET()).json();

  return (
    <Section id="feedbacks" className=" relative py-[70px]">
      <h2 className="mb-[24px] font-philosopher font-bold text-fs60 text-localbrown">
        Відгуки
      </h2>

      <p className="mb-[20px] text-fs24">За останній час</p>

      <FeedbackSlider data={feedbacks} />

      <ButtonOpenFormFeedback />
    </Section>
  );
};

export default SectionFeedbacks;
