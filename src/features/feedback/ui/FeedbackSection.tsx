import { headers } from "next/headers";

import ButtonOpenFormFeedback from "./ButtonOpenFormFeedback";
import FeedbackSlider from "@/widgets/landing-sections/FeedbackSlider";
import { getPublicFeedbacks } from "@/shared/api/client";
import Container from "@/shared/ui/Container/Container";

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

export default async function FeedbackSection({
  id = "feedback",
}: {
  id?: string;
} = {}) {
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
    <section id={id} className="py-[70px]">
      <Container className="flex flex-col">
        <div className="mb-[24px]">
          <h2 className="font-philosopher text-[60px] font-bold leading-none text-localbrown">
            Отзывы
          </h2>
          <p className="mt-[24px] text-[24px] leading-none text-black">
            За последнее время
          </p>
        </div>

        <div>
          <FeedbackSlider data={activeFeedbacks} />
        </div>

        <div className="mt-[20px] flex items-center justify-between gap-4">
          <p className="text-[12px] leading-none text-[#333]">
            Только зарегистрированные пользователи могут оставить отзыв
          </p>

          <div className="flex items-center gap-4">
            <p className="text-[22px] font-semibold text-localbrown">
              {formatAverageRating(activeFeedbacks)}
            </p>
            <ButtonOpenFormFeedback />
          </div>
        </div>
      </Container>
    </section>
  );
}
