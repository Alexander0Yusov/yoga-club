"use client";

import { useMemo, useState } from "react";

import useStore from "@/store/a_store";

import type { BookingMock, BookingStatus } from "../model/bookings";
import { bookingsMock } from "../model/bookings";
import BookingsItem from "./BookingsItem";

type BookingsGalleryProps = {
  mode: "user" | "admin";
};

const pickUserBookings = (bookings: BookingMock[], userEmail?: string) => {
  if (!userEmail) {
    return bookings;
  }

  const filtered = bookings.filter(
    (booking) => booking.ownerEmail === userEmail,
  );

  return filtered.length > 0 ? filtered : bookings;
};

export default function BookingsGallery({ mode }: BookingsGalleryProps) {
  const currentUser = useStore((state) => state.user);
  const canModerate = mode === "admin";
  const canCancel = mode === "user";
  const [items, setItems] = useState<BookingMock[]>(bookingsMock);

  const visibleItems = useMemo(
    () => pickUserBookings(items, currentUser?.email),
    [currentUser?.email, items],
  );

  const handleStatusChange = (id: string, status: BookingStatus) => {
    setItems((current) =>
      current.map((booking) =>
        booking.id === id ? { ...booking, status } : booking,
      ),
    );
  };

  const handleCancel = (id: string) => {
    setItems((current) => current.filter((booking) => booking.id !== id));
  };

  return (
    <div className="space-y-4">
      {visibleItems.map((booking) => (
        <BookingsItem
          key={booking.id}
          booking={booking}
          canModerate={canModerate}
          canCancel={canCancel}
          onStatusChange={handleStatusChange}
          onCancel={handleCancel}
        />
      ))}
    </div>
  );
}
