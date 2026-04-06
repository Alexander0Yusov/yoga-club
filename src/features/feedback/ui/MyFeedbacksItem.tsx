"use client";

import IconDelete from "@/shared/ui/IconDelete";
import IconEdit from "@/shared/ui/IconEdit";

type MyFeedbacksItemProps = {
  id: string;
  date: string;
  text: string;
  edit: (id: string) => void;
  del: (id: string) => void;
};

export default function MyFeedbacksItem({
  id,
  date,
  text,
  edit,
  del,
}: MyFeedbacksItemProps) {
  const originalDate = new Date(date);
  const year = originalDate.getFullYear();
  const month = String(originalDate.getMonth() + 1).padStart(2, "0");
  const day = String(originalDate.getDate()).padStart(2, "0");

  return (
    <div className="flex items-start gap-3 rounded-[14px] border border-lilac p-4">
      <p className="w-[150px] shrink-0 text-sm text-[#497274]">{`${year}-${month}-${day}`}</p>
      <p className="min-w-0 flex-1 rounded-[10px] border border-lilac p-4 text-sm leading-6 text-[#4f2a26]">
        {text.length > 160 ? `${text.slice(0, 160)}...` : text}
      </p>
      <button type="button" className="shrink-0" onClick={() => edit(id)}>
        <IconEdit />
      </button>
      <button type="button" className="shrink-0" onClick={() => del(id)}>
        <IconDelete />
      </button>
    </div>
  );
}
