import Image from "next/image";
import Link from "next/link";
import React from "react";

import { events_lib } from "@/lib/dataEvents";

type EventItemProps = {
  id: string;
  slug?: string;
  title: string;
  date?: string;
  timeTarget?: string;
  description?: string;
  imageUrl?: string;
  picsArray?: { value: string }[];
  defaultImg?: number;
  isActive?: boolean;
  deletedAt?: string | null;
  canModerate?: boolean;
  canHardDelete?: boolean;
  onEdit?: (id: string) => void;
  onToggleVisibility?: (id: string, nextState: boolean) => void;
  onSoftDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onHardDelete?: (id: string) => void;
  linkToDetail?: boolean;
};

const EventsItem = ({
  id,
  slug,
  title,
  date,
  timeTarget,
  description,
  imageUrl,
  picsArray,
  defaultImg = 0,
  isActive = true,
  deletedAt = null,
  canModerate = false,
  canHardDelete = false,
  onEdit,
  onToggleVisibility,
  onSoftDelete,
  onRestore,
  onHardDelete,
  linkToDetail = true,
}: EventItemProps) => {
  const isTrashed = deletedAt !== null;
  const statusText = isTrashed ? "Trashed" : isActive ? "Active" : "Hidden";
  const statusClass = isTrashed
    ? "bg-red-100 text-red-700"
    : isActive
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";
  const formattedDate = new Date(date || timeTarget || new Date().toISOString()).toLocaleDateString("en-GB");
  const detailHref = `/events/${slug || id}`;
  const imageSrc =
    imageUrl || picsArray?.[0]?.value || events_lib[defaultImg % events_lib.length].value;

  const content = (
    <article className="overflow-hidden rounded-[18px] border border-[#dfbeaf] bg-white shadow-sm">
      <div className="grid gap-4 p-4 xl:grid-cols-[320px_1fr] xl:items-stretch">
        <div className="relative h-[220px] overflow-hidden rounded-[16px] border border-[#dfbeaf] bg-[#f9f3ef]">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 1280px) 100vw, 320px"
            className="object-cover object-center"
          />
        </div>

        <div className="flex min-h-[220px] flex-col">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#497274]">
                Event
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[#81453e]">{title}</h3>
              <p className="mt-1 text-sm text-[#c57665]">{formattedDate}</p>
            </div>

            {canModerate && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`rounded-full px-3 py-1 ${statusClass}`}>
                  {statusText}
                </span>
              </div>
            )}
          </div>

          {description && (
            <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#4f2a26]">
              {description}
            </p>
          )}

          {canModerate && (
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              <button
                type="button"
                onClick={() => onEdit?.(id)}
                className="rounded-full border border-[#497274] px-3 py-2 text-xs text-[#497274]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onToggleVisibility?.(id, !isActive)}
                className={`rounded-full border px-3 py-2 text-xs transition-colors ${
                  isActive
                    ? "border-amber-600 bg-amber-50 text-amber-700"
                    : "border-emerald-600 bg-emerald-50 text-emerald-700"
                }`}
              >
                {isActive ? "Hide" : "Show"}
              </button>
              {!isTrashed ? (
                <button
                  type="button"
                  onClick={() => onSoftDelete?.(id)}
                  className="rounded-full border border-[#81453e] px-3 py-2 text-xs text-[#81453e]"
                >
                  Trash
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onRestore?.(id)}
                    className="rounded-full border border-[#81453e] px-3 py-2 text-xs text-[#81453e]"
                  >
                    Restore
                  </button>
                  {canHardDelete && (
                    <button
                      type="button"
                      onClick={() => onHardDelete?.(id)}
                      className="rounded-full border border-red-600 px-3 py-2 text-xs text-red-700"
                    >
                      Delete permanently
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );

  if (!linkToDetail || canModerate) {
    return content;
  }

  return <Link href={detailHref}>{content}</Link>;
};

export default EventsItem;
