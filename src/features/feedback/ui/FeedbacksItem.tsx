"use client";

type FeedbackItemProps = {
  id: string;
  authorName: string;
  comment: string;
  rating: number;
  date: string;
  isActive: boolean;
  deletedAt: string | null;
  canModerate: boolean;
  canHardDelete: boolean;
  onToggleVisibility: (id: string, nextState: boolean) => void;
  onSoftDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onHardDelete: (id: string) => void;
};

export default function FeedbacksItem({
  id,
  authorName,
  comment,
  rating,
  date,
  isActive,
  deletedAt,
  canModerate,
  canHardDelete,
  onToggleVisibility,
  onSoftDelete,
  onRestore,
  onHardDelete,
}: FeedbackItemProps) {
  const formattedDate = new Date(date).toLocaleDateString("uk-UA");
  const isTrashed = deletedAt !== null;

  return (
    <article className="rounded-[18px] border border-[#dfbeaf] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#497274]">
            Відгук
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[#81453e]">
            {authorName}
          </h3>
          <p className="mt-1 text-sm text-[#c57665]">Rating: {rating}/5</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-[#dfbeaf] px-3 py-1 text-[#4f2a26]">
            {formattedDate}
          </span>
          <span
            className={`rounded-full px-3 py-1 ${
              isTrashed
                ? "bg-red-100 text-red-700"
                : isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
            }`}
          >
            {isTrashed ? "Trashed" : isActive ? "Visible" : "Hidden"}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-[#4f2a26]">{comment}</p>

      {canModerate && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onToggleVisibility(id, !isActive)}
            className={`rounded-full border px-3 py-2 text-xs transition-colors ${
              isActive
                ? "border-amber-600 bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            {isActive ? "Hide" : "Show"}
          </button>
          {!isTrashed ? (
            <button
              type="button"
              onClick={() => onSoftDelete(id)}
              className="rounded-full border border-[#81453e] px-3 py-2 text-xs text-[#81453e]"
            >
              Trash
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onRestore(id)}
                className="rounded-full border border-[#81453e] px-3 py-2 text-xs text-[#81453e]"
              >
                Restore
              </button>
              {canHardDelete && (
                <button
                  type="button"
                  onClick={() => onHardDelete(id)}
                  className="rounded-full border border-red-600 px-3 py-2 text-xs text-red-700"
                >
                  Delete permanently
                </button>
              )}
            </>
          )}
        </div>
      )}
    </article>
  );
}
