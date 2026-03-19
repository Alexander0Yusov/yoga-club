import Link from "next/link";

import FeedbackSlider from "./FeedbackSlider";

function SectionCard({
  title,
  description,
  href,
  tone = "light",
}: {
  title: string;
  description: string;
  href: string;
  tone?: "light" | "accent";
}) {
  const toneClasses =
    tone === "accent"
      ? "border-[#81453e] bg-[#c57665] text-white"
      : "border-[#dfbeaf] bg-white text-[#2f1815]";

  return (
    <article className={`rounded-[24px] border p-6 shadow-sm ${toneClasses}`}>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 opacity-90">{description}</p>
      <Link
        href={href}
        className="mt-5 inline-flex rounded-full border border-current px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
      >
        Open section
      </Link>
    </article>
  );
}

export default function LandingSections({ lang }: { lang: string }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 rounded-[32px] border border-[#dfbeaf] bg-gradient-to-br from-[#faf7f4] to-[#f3ece8] p-6 md:grid-cols-[1.35fr_0.65fr] md:p-10">
        <div className="flex flex-col justify-between gap-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-[#497274]">Paraglide-ready routing</p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-[#81453e] md:text-6xl">
              Yoga Club landing is now rooted in `src/app/[lang]/`.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#4f2a26]">
              The new shell keeps global bookings and feedback as independent modules, while the visual landing
              still exposes the same core actions for guests.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${lang}/events/upcoming`}
              className="rounded-full bg-[#81453e] px-5 py-3 text-sm font-medium text-white"
            >
              View upcoming gallery
            </Link>
            <Link
              href={`/${lang}/account`}
              className="rounded-full border border-[#81453e] px-5 py-3 text-sm font-medium text-[#81453e]"
            >
              Open dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[24px] border border-[#dfbeaf] bg-white p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-[#497274]">Global bookings</p>
            <p className="mt-2 text-lg font-semibold text-[#81453e]">Independent booking flow</p>
            <p className="mt-2 text-sm leading-6 text-[#4f2a26]">
              Booking actions remain global and are not tied to a specific event ID yet.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#dfbeaf] bg-[#faf7f4] p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-[#497274]">Feedback & reviews</p>
            <p className="mt-2 text-lg font-semibold text-[#81453e]">Visible from day one</p>
            <p className="mt-2 text-sm leading-6 text-[#4f2a26]">
              Reviews stay as a separate visual module so the guest experience keeps the familiar structure.
            </p>
            <div className="mt-5">
              <FeedbackSlider />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <SectionCard
          title="Global bookings"
          description="Independent booking triggers will live outside event pages and stay reusable across the platform."
          href={`/${lang}/account?tab=bookings`}
          tone="accent"
        />
        <SectionCard
          title="Feedback / Reviews"
          description="Feedback keeps its own surface and will not be coupled to event identifiers during this phase."
          href={`/${lang}/account?tab=reviews`}
        />
      </section>
    </div>
  );
}
