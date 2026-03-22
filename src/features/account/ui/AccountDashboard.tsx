"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import ProfileForm from "./ProfileForm";

type AccountTab = "general" | "bookings" | "reviews";

const tabs: Array<{ key: AccountTab; label: string }> = [
  { key: "general", label: "General Info" },
  { key: "bookings", label: "My Bookings" },
  { key: "reviews", label: "My Reviews" },
];

const AccountDashboard = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as AccountTab) || "general";

  const tabBase =
    "rounded-full border px-4 py-2 text-sm transition-colors duration-200";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-[#497274]">
          Account
        </p>
        <h1 className="text-4xl font-semibold text-[#81453e]">User Dashboard</h1>
        <p className="max-w-3xl text-[#497274]">
          General info, bookings, and reviews stay in one flat account surface
          for this phase.
        </p>
      </div>

      <nav className="mt-8 flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const href = `${pathname}?tab=${tab.key}`;
          const isActive = activeTab === tab.key;

          return (
            <Link
              key={tab.key}
              href={href}
              className={`${tabBase} ${
                isActive
                  ? "border-[#81453e] bg-[#81453e] text-white"
                  : "border-[#81453e] text-[#81453e]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <article className="rounded-[24px] border border-[#dfbeaf] bg-white p-6 shadow-sm">
          {activeTab === "general" && <ProfileForm />}

          {activeTab === "bookings" && (
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-[#81453e]">
                Global Bookings
              </h2>
              <p className="text-sm leading-6 text-[#4f2a26]">
                Booking history will remain a global module and will not be
                tied to a specific event entity yet.
              </p>
              <div className="rounded-[18px] border border-dashed border-[#dfbeaf] bg-[#faf7f4] p-5 text-sm text-[#4f2a26]">
                Booking list placeholder. Real data will be connected in the
                next slice.
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-[#81453e]">
                Feedback / Reviews
              </h2>
              <p className="text-sm leading-6 text-[#4f2a26]">
                Review history stays visible here as an independent account
                module for guests and authenticated users.
              </p>
              <div className="rounded-[18px] border border-dashed border-[#dfbeaf] bg-[#faf7f4] p-5 text-sm text-[#4f2a26]">
                Reviews placeholder. The next slice will mount the synced
                review list here.
              </div>
            </div>
          )}
        </article>

        <aside className="space-y-6">
          <article className="rounded-[24px] border border-[#dfbeaf] bg-[#faf7f4] p-6">
            <h2 className="text-2xl font-semibold text-[#81453e]">
              Account Snapshot
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#4f2a26]">
              This shell is intentionally simple while the migration continues.
              It keeps the layout stable and the account route alive.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#dfbeaf] bg-white p-6">
            <h2 className="text-2xl font-semibold text-[#81453e]">
              Migration Note
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#4f2a26]">
              The old profile route can stay as a temporary bridge while we
              shift the active user cabinet to the new App Router tree.
            </p>
          </article>
        </aside>
      </section>
    </main>
  );
};

export default AccountDashboard;
