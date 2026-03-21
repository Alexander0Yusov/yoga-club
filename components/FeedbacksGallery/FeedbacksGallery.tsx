"use client";

import React, { useEffect, useMemo, useState } from "react";

import useStore from "@/store/a_store";
import {
  hardDeleteFeedback,
  restoreFeedback,
  softDeleteFeedback,
  toggleFeedbackVisibility,
} from "@/shared/api/client";
import FeedbacksItem from "../FeedbacksItem/FeedbacksItem";

type FeedbackRow = {
  _id: string;
  authorName?: string;
  comment?: string;
  text?: string;
  rating?: number;
  createdAt?: string;
  date?: string;
  isActive?: boolean;
  deletedAt?: string | null;
};

const FeedbacksGallery = () => {
  const user = useStore((state) => state.user);
  const [feedbacks, setFeedbacks] = useState<FeedbackRow[]>([]);
  const [showTrash, setShowTrash] = useState(false);
  const currentViewMode = user?.viewMode || user?.role || "USER";

  const isSuperAdmin =
    user?.email === "yusovsky2@gmail.com" ||
    user?.originalRole === "SUPERADMIN";
  const canModerate = currentViewMode === "ADMIN" || currentViewMode === "SUPERADMIN";
  const canHardDelete = isSuperAdmin;

  const reloadFeedbacks = async () => {
    const result = await fetch(feedbackUrl, { cache: "no-store" });
    const res = (await result.json()) as FeedbackRow[];
    setFeedbacks(res);
  };

  const feedbackUrl = useMemo(() => {
    const params = new URLSearchParams({
      viewMode: currentViewMode,
    });

    if (showTrash && isSuperAdmin) {
      params.set("showTrash", "1");
    }

    return `/api/feedbacks?${params.toString()}`;
  }, [currentViewMode, isSuperAdmin, showTrash]);

  useEffect(() => {
    void reloadFeedbacks();
  }, [feedbackUrl]);

  const handleToggleVisibility = async (id: string, nextState: boolean) => {
    setFeedbacks((current) =>
      current.map((item) =>
        item._id === id ? { ...item, isActive: nextState } : item
      )
    );

    await toggleFeedbackVisibility({
      id,
      isActive: nextState,
      viewMode: currentViewMode as "USER" | "ADMIN" | "SUPERADMIN",
    });
    await reloadFeedbacks();
  };

  const handleSoftDelete = async (id: string) => {
    setFeedbacks((current) =>
      current.map((item) =>
        item._id === id
          ? { ...item, isActive: false, deletedAt: new Date().toISOString() }
          : item
      )
    );

    await softDeleteFeedback({
      id,
      viewMode: currentViewMode as "USER" | "ADMIN" | "SUPERADMIN",
    });
    await reloadFeedbacks();
  };

  const handleRestore = async (id: string) => {
    setFeedbacks((current) =>
      current.map((item) =>
        item._id === id ? { ...item, isActive: true, deletedAt: null } : item
      )
    );

    await restoreFeedback({
      id,
      viewMode: currentViewMode as "USER" | "ADMIN" | "SUPERADMIN",
    });
    await reloadFeedbacks();
  };

  const handleHardDelete = async (id: string) => {
    setFeedbacks((current) => current.filter((item) => item._id !== id));

    await hardDeleteFeedback({
      id,
      viewMode: currentViewMode as "USER" | "ADMIN" | "SUPERADMIN",
    });
    await reloadFeedbacks();
  };

  return (
    <div className="space-y-5">
      {isSuperAdmin && (
        <button
          type="button"
          onClick={() => setShowTrash((value) => !value)}
          className="rounded-full border border-[#81453e] px-4 py-2 text-sm text-[#81453e]"
        >
          {showTrash ? "Hide deleted items" : "Show deleted items"}
        </button>
      )}

      <ul className="flex flex-col gap-4">
        {feedbacks.map((item) => (
          <li key={item._id}>
            <FeedbacksItem
              id={item._id}
              authorName={item.authorName || "Guest"}
              comment={item.comment || item.text || ""}
              rating={item.rating || 5}
              date={item.date || item.createdAt || new Date().toISOString()}
              isActive={item.isActive !== false}
              deletedAt={item.deletedAt ?? null}
              canModerate={canModerate}
              canHardDelete={canHardDelete}
              onToggleVisibility={handleToggleVisibility}
              onSoftDelete={handleSoftDelete}
              onRestore={handleRestore}
              onHardDelete={handleHardDelete}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbacksGallery;
