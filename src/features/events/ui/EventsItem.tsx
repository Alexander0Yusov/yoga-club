import Image from "next/image";
import Link from "next/link";

import { events_lib } from "@/lib/dataEvents";
import IconInstagram from "@/shared/ui/IconInstagram";

type EventItemProps = {
  lang?: string;
  id: string;
  slug?: string;
  title: string;
  date?: string;
  timeTarget?: string;
  endTimeTarget?: string;
  description?: string;
  imageUrl?: string;
  instagramUrl?: string;
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
  lang,
  id,
  slug,
  title,
  date,
  timeTarget,
  endTimeTarget,
  description,
  imageUrl,
  instagramUrl,
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
  const statusText = isTrashed ? "Треш" : isActive ? "Активна" : "Прихована";
  const statusClass = isTrashed
    ? "bg-red-100 text-red-700"
    : isActive
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";
  const formattedDate = new Date(
    date || timeTarget || new Date().toISOString()
  ).toLocaleDateString("uk-UA");
  const detailHref = lang ? `/${lang}/events/${slug || id}` : `/events/${slug || id}`;
  const imageSrc =
    imageUrl ||
    picsArray?.[0]?.value ||
    events_lib[defaultImg % events_lib.length].value;

  const cardContent = (
    <div className="grid gap-0 border border-[#cdb2a8] bg-white md:grid-cols-[340px_minmax(0,1fr)] lg:grid-cols-[360px_minmax(0,1fr)]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[#cdb2a8] bg-white md:aspect-auto md:min-h-[244px] md:border-b-0 md:border-r">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-cover object-center transition duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex min-h-[244px] flex-col justify-between px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-[#497274]">Подія</p>
              <h3 className="text-[22px] font-medium leading-tight text-[#81453e] md:text-[24px]">
                {title}
              </h3>
              <p className="text-[15px] text-[#c57665] md:text-[16px]">{formattedDate}</p>
            </div>

            {canModerate && (
              <span className={`whitespace-nowrap px-3 py-1 text-xs ${statusClass}`}>
                {statusText}
              </span>
            )}
          </div>

          {instagramUrl && (
            <div className="inline-flex items-center gap-2 border border-[#497274] px-2 py-1 text-[12px] uppercase tracking-[0.14em] text-[#497274]">
              <IconInstagram className="h-4 w-4" />
              <span>Instagram</span>
            </div>
          )}

          {description && (
            <p className="line-clamp-5 text-[15px] leading-7 text-[#4f2a26] md:text-[16px]">
              {description}
            </p>
          )}
        </div>

        <p className="mt-4 text-[14px] uppercase tracking-[0.18em] text-[#497274] md:text-[15px]">
          Детальніше
        </p>
      </div>
    </div>
  );

  const adminActions = canModerate ? (
    <div className="flex flex-wrap gap-2 border-x border-b border-[#cdb2a8] bg-white px-4 py-4">
      <button
        type="button"
        onClick={() => onEdit?.(id)}
        className="rounded-none border border-[#497274] px-3 py-2 text-xs text-[#497274]"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onToggleVisibility?.(id, !isActive)}
        className={`rounded-none border px-3 py-2 text-xs transition-colors ${
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
          className="rounded-none border border-[#81453e] px-3 py-2 text-xs text-[#81453e]"
        >
          Trash
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => onRestore?.(id)}
            className="rounded-none border border-[#81453e] px-3 py-2 text-xs text-[#81453e]"
          >
            Restore
          </button>
          {canHardDelete && (
            <button
              type="button"
              onClick={() => onHardDelete?.(id)}
              className="rounded-none border border-red-600 px-3 py-2 text-xs text-red-700"
            >
              Delete permanently
            </button>
          )}
        </>
      )}
    </div>
  ) : null;

  if (!linkToDetail) {
    return (
      <article className="group">
        {cardContent}
        {adminActions}
      </article>
    );
  }

  return (
    <article className="group">
      <Link href={detailHref} className="block">
        {cardContent}
      </Link>
      {adminActions}
    </article>
  );
};

export default EventsItem;
