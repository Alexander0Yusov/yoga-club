"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import type { LocaleT } from "@/i18nConfig";
import Container from "@/shared/ui/Container/Container";
import useStore from "@/store/a_store";

import SignOutButton from "@/features/auth/ui/SignOutButton";
import EventsGallery from "@/features/events/ui/EventsGallery";
import DemoVideosGallery from "@/features/demo-video/ui/DemoVideosGallery";
import BookingsGallery from "@/features/bookings/ui/BookingsGallery";
import FeedbacksGallery from "@/features/feedback/ui/FeedbacksGallery";
import MyFeedbacksGallery from "@/features/feedback/ui/MyFeedbacksGallery";
import UsersGallery from "@/features/users/ui/UsersGallery";
import ProfileForm from "./ProfileForm";

type AccountTab =
  | "personal"
  | "my-reviews"
  | "reviews"
  | "my-bookings"
  | "bookings"
  | "events"
  | "demo-video"
  | "users";

type AccountDashboardProps = {
  lang: LocaleT;
};

const tabs: Array<{ key: AccountTab; label: string }> = [
  { key: "personal", label: "Особисті дані" },
  { key: "my-reviews", label: "Мої відгуки" },
  { key: "reviews", label: "Відгуки" },
  { key: "my-bookings", label: "Мої заявки" },
  { key: "bookings", label: "Заявки" },
  { key: "events", label: "Події" },
  { key: "demo-video", label: "Демо відео" },
  { key: "users", label: "Користувачі" },
];

const normalizeTab = (value: string | null): AccountTab => {
  switch (value) {
    case "my-reviews":
    case "reviews":
    case "my-bookings":
    case "bookings":
    case "events":
    case "demo-video":
    case "users":
    case "personal":
      return value;
    case "general":
      return "personal";
    default:
      return "personal";
  }
};

const AccountDashboard = ({ lang }: AccountDashboardProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUser = useStore((state) => state.user);
  const activeTab = normalizeTab(searchParams.get("tab"));
  const isAdmin =
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "SUPERADMIN" ||
    currentUser?.originalRole === "SUPERADMIN";
  const visibleTabs = tabs.filter((tab) => {
    if (tab.key === "bookings" || tab.key === "users") {
      return isAdmin;
    }

    return true;
  });
  const visibleTabKeys = new Set(visibleTabs.map((tab) => tab.key));
  const effectiveTab =
    visibleTabKeys.has(activeTab)
      ? activeTab
      : activeTab === "bookings"
        ? "my-bookings"
        : "personal";

  const tabBase =
    "flex h-[40px] w-[160px] items-center justify-center rounded-t-[10px] border border-b-0 px-4 text-[16px] transition-colors duration-200";

  return (
    <Container className="py-10">
      <div className="mb-[30px] flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-[#497274]">
            Ваш профіль
          </p>
          <h1 className="font-philosopher text-[44px] font-bold leading-none text-localbrown md:text-[60px]">
            Кабінет користувача
          </h1>
        </div>

        <SignOutButton lang={lang} />
      </div>

      <nav>
        <ul className="flex flex-wrap gap-4 border-b border-[#497274]">
          {visibleTabs.map((tab) => {
            const href = `${pathname}?tab=${tab.key}`;
            const isActive = effectiveTab === tab.key;

            return (
              <li key={tab.key}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`${tabBase} ${
                    isActive
                      ? "border-[#497274] bg-[#dfd9dc] font-bold text-[#2c2c2c]"
                      : "border-[#497274] bg-white text-[#497274]"
                  }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <section className="border border-[#497274] bg-white p-6">
        {effectiveTab === "personal" && <ProfileForm />}
        {effectiveTab === "my-reviews" && <MyFeedbacksGallery />}
        {effectiveTab === "reviews" && <FeedbacksGallery />}
        {effectiveTab === "my-bookings" && <BookingsGallery mode="user" />}
        {effectiveTab === "bookings" && <BookingsGallery mode="admin" />}
        {effectiveTab === "events" && <EventsGallery linkToDetail={false} />}
        {effectiveTab === "demo-video" && <DemoVideosGallery />}
        {effectiveTab === "users" && <UsersGallery />}
      </section>
    </Container>
  );
};

export default AccountDashboard;
