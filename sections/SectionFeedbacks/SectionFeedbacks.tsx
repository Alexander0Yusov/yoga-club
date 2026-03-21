import React from "react";
import Section from "@/components/0_ui/Section/Section";
import ButtonOpenFormFeedback from "@/components/ButtonOpenFormFeedback/ButtonOpenFormFeedback";
import FeedbackSlider from "@/components/FeedbackSlider/FeedbackSlider";

const SectionFeedbacks = async () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const feedbacks = await fetch(`${siteUrl}/api/feedbacks`, {
    cache: "no-store",
  }).then((response) => response.json());

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
