"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import useStore from "@/store/a_store";
import {
  hardDeleteFeedback,
  getFeedbacks,
  restoreFeedback,
  softDeleteFeedback,
  toggleFeedbackVisibility,
} from "@/shared/api/client";
import FeedbacksItem from "./FeedbacksItem";

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

export default function FeedbacksGallery() {
  const user = useStore((state) => state.user);
  const [feedbacks, setFeedbacks] = useState<FeedbackRow[]>([]);
  const [showTrash, setShowTrash] = useState(false);
  const currentViewMode = (user?.viewMode || user?.role || "USER") as
    | "USER"
    | "ADMIN"
    | "SUPERADMIN";

  const isSuperAdmin =
    user?.role === "SUPERADMIN" ||
    user?.originalRole === "SUPERADMIN";
  const canModerate =
    currentViewMode === "ADMIN" || currentViewMode === "SUPERADMIN";

  const feedbackQuery = useMemo(
    () => ({
      viewMode: currentViewMode,
      showTrash: showTrash && isSuperAdmin,
    }),
    [currentViewMode, isSuperAdmin, showTrash],
  );

  const reloadFeedbacks = useCallback(async () => {
    const result = await getFeedbacks<FeedbackRow[]>(feedbackQuery);
    setFeedbacks(result);
  }, [feedbackQuery]);

  useEffect(() => {
    void reloadFeedbacks();
  }, [reloadFeedbacks]);

  const handleToggleVisibility = async (id: string, nextState: boolean) => {
    setFeedbacks((current) =>
      current.map((item) =>
        item._id === id ? { ...item, isActive: nextState } : item,
      ),
    );

    await toggleFeedbackVisibility({
      id,
      isActive: nextState,
      viewMode: currentViewMode,
    });
    await reloadFeedbacks();
  };

  const handleSoftDelete = async (id: string) => {
    setFeedbacks((current) =>
      current.map((item) =>
        item._id === id
          ? { ...item, isActive: false, deletedAt: new Date().toISOString() }
          : item,
      ),
    );

    await softDeleteFeedback({
      id,
      viewMode: currentViewMode,
    });
    await reloadFeedbacks();
  };

  const handleRestore = async (id: string) => {
    setFeedbacks((current) =>
      current.map((item) =>
        item._id === id ? { ...item, isActive: true, deletedAt: null } : item,
      ),
    );

    await restoreFeedback({
      id,
      viewMode: currentViewMode,
    });
    await reloadFeedbacks();
  };

  const handleHardDelete = async (id: string) => {
    setFeedbacks((current) => current.filter((item) => item._id !== id));

    await hardDeleteFeedback({
      id,
      viewMode: currentViewMode,
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
          {showTrash ? "Сховати корзину" : "Показати корзину"}
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
              canHardDelete={isSuperAdmin}
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
}
