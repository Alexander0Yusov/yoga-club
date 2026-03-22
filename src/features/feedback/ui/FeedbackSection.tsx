import { headers } from "next/headers";

import ButtonOpenFormFeedback from "./ButtonOpenFormFeedback";
import FeedbackSlider from "@/widgets/landing-sections/FeedbackSlider";
import { getPublicFeedbacks } from "@/shared/api/client";

type FeedbackItem = {
  _id: string;
  authorName?: string;
  avatarUrl?: string;
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

export default async function FeedbackSection() {
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
    feedbacks = await getPublicFeedbacks<FeedbackItem[]>({ siteUrl });
  } catch {
    feedbacks = [];
  }

  const activeFeedbacks = feedbacks.filter(
    (item) => item.isActive !== false && item.deletedAt === null,
  );

  return (
    <section className="rounded-[32px] border border-[#dfbeaf] bg-[#faf7f4] p-6 md:p-10">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.25em] text-[#497274]">
          Feedback & reviews
        </p>
        <h2 className="text-3xl font-semibold text-[#81453e] md:text-4xl">
          Visible from day one
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-[#4f2a26]">
          Reviews stay as a separate visual module so the guest experience
          keeps the familiar structure.
        </p>
      </div>

      <div className="mt-6">
        <FeedbackSlider data={feedbacks} />
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-[12px] text-[#333]">
          Only registered users can leave reviews
        </p>

        <div className="flex items-center gap-4">
          <p className="text-[22px] font-semibold text-localbrown">
            {formatAverageRating(activeFeedbacks)}
          </p>
          <ButtonOpenFormFeedback />
        </div>
      </div>
    </section>
  );
}
