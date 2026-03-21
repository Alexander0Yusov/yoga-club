import React from "react";
import { headers } from "next/headers";

import ButtonOpenFormFeedback from "@/components/ButtonOpenFormFeedback/ButtonOpenFormFeedback";
import FeedbackSlider from "@/components/FeedbackSlider/FeedbackSlider";
import Section from "@/components/0_ui/Section/Section";

type FeedbackItem = {
  _id: string;
  authorName?: string;
  comment?: string;
  text?: string;
  rating?: number;
  date?: string;
  isActive?: boolean;
  deletedAt?: string | null;
};

function formatAverageRating(feedbacks: FeedbackItem[]) {
  if (feedbacks.length === 0) {
    return "0.0/5";
  }

  const total = feedbacks.reduce((sum, item) => sum + (item.rating || 0), 0);
  return `${(total / feedbacks.length).toFixed(1)}/5`;
}

const SectionFeedbacks = async () => {
  const requestHeaders = headers();
  const forwardedHost =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProto =
    requestHeaders.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : "http://localhost:3000");

  let feedbacks: FeedbackItem[] = [];

  try {
    const response = await fetch(new URL("/api/feedbacks", siteUrl), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Feedbacks request failed with ${response.status}`);
    }

    feedbacks = (await response.json()) as FeedbackItem[];
  } catch {
    feedbacks = [];
  }

  return (
    <Section id="feedbacks" className="relative overflow-x-clip py-[70px]">
      <h2 className="mb-[24px] font-philosopher font-bold text-fs60 text-localbrown">
        Відгуки
      </h2>

      <p className="mb-[20px] text-fs24">За останній час</p>

      <FeedbackSlider data={feedbacks} />

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-[12px] text-[#333]">
          Only registered users can leave reviews
        </p>

        <div className="flex items-center gap-4">
          <p className="text-[22px] font-semibold text-localbrown">
            {formatAverageRating(feedbacks)}
          </p>
          <ButtonOpenFormFeedback />
        </div>
      </div>
    </Section>
  );
};

export default SectionFeedbacks;
