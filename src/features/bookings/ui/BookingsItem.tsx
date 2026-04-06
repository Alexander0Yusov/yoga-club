import Image from "next/image";
import { useMemo, useState } from "react";

import type { BookingMock, BookingStatus } from "../model/bookings";
import { bookingStatusClass, bookingStatusLabel } from "../model/bookings";

type BookingsItemProps = {
  booking: BookingMock;
  canModerate: boolean;
  canCancel: boolean;
  onStatusChange?: (id: string, status: BookingStatus) => void;
  onCancel?: (id: string) => void;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

export default function BookingsItem({
  booking,
  canModerate,
  canCancel,
  onStatusChange,
  onCancel,
}: BookingsItemProps) {
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const initials = useMemo(() => getInitials(booking.name), [booking.name]);

  const handleStatusChange = (nextStatus: BookingStatus) => {
    setStatus(nextStatus);
    onStatusChange?.(booking.id, nextStatus);
  };

  return (
    <article className="border border-[#497274] bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex items-start gap-4 lg:min-w-[250px]">
          <div className="relative h-[56px] w-[56px] shrink-0 overflow-hidden border border-[#497274] bg-[#dfd9dc]">
            {booking.avatarUrl ? (
              <Image
                src={booking.avatarUrl}
                alt={booking.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[18px] font-semibold text-[#497274]">
                {initials}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-[13px] uppercase tracking-[0.22em] text-[#497274]">
              Заявка
            </p>
            <h3 className="text-[18px] font-semibold text-[#81453e]">
              {booking.name}
            </h3>
            <p className="text-[14px] text-[#2c2c2c]">{booking.phone}</p>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-[15px] leading-6 text-[#4f2a26]">
            {booking.comment}
          </p>

          {booking.eventTitle && (
            <p className="text-[14px] text-[#497274]">
              <span className="font-medium">Подія:</span> {booking.eventTitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#2c2c2c]">
            <span className="font-medium text-[#497274]">Статус:</span>
            {canModerate ? (
              <select
                value={status}
                onChange={(event) =>
                  handleStatusChange(event.target.value as BookingStatus)
                }
                className="h-[38px] min-w-[150px] border border-[#497274] bg-white px-3 text-[#2c2c2c] outline-none"
              >
                <option value="pending">Пендинг</option>
                <option value="approve">Аппрув</option>
                <option value="reject">Реджект</option>
              </select>
            ) : (
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${bookingStatusClass[status]}`}
              >
                {bookingStatusLabel[status]}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 lg:items-end">
          <p className="text-[13px] text-[#497274]">{booking.date}</p>
          <p className="text-[13px] text-[#497274]">{booking.time}</p>

          {canCancel && (
            <button
              type="button"
              onClick={() => onCancel?.(booking.id)}
              className="mt-2 h-[38px] rounded-full border border-[#81453e] px-4 text-[14px] text-[#81453e] transition-colors hover:bg-[#81453e] hover:text-white"
            >
              Скасувати бронь
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
