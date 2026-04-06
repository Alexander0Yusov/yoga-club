export type BookingStatus = "pending" | "approve" | "reject";

export type BookingMock = {
  id: string;
  name: string;
  phone: string;
  comment: string;
  status: BookingStatus;
  ownerEmail: string;
  date: string;
  time: string;
  eventTitle?: string;
  avatarUrl?: string;
};

export const bookingStatusLabel: Record<BookingStatus, string> = {
  pending: "Пендинг",
  approve: "Аппрув",
  reject: "Реджект",
};

export const bookingStatusClass: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approve: "bg-emerald-100 text-emerald-700",
  reject: "bg-rose-100 text-rose-700",
};

export const bookingsMock: BookingMock[] = [
  {
    id: "booking-1",
    name: "Ірина Коваль",
    phone: "+380962377140",
    comment: "Хочу потрапити на ранкову практику.",
    status: "pending",
    ownerEmail: "yusovsky2@gmail.com",
    date: "2026-03-28",
    time: "08:00",
    eventTitle: "Практика для початківців",
  },
  {
    id: "booking-2",
    name: "Олена Савчук",
    phone: "+380955553322",
    comment: "Підходить цей слот, прошу підтвердити бронь.",
    status: "approve",
    ownerEmail: "yusovsky2@gmail.com",
    date: "2026-03-29",
    time: "09:30",
    eventTitle: "Ранкова віньяса",
  },
  {
    id: "booking-3",
    name: "Марина Бойко",
    phone: "+380671112233",
    comment: "Потрібно перенести на інший час, якщо можливо.",
    status: "reject",
    ownerEmail: "yusovsky2@gmail.com",
    date: "2026-03-30",
    time: "18:00",
    eventTitle: "Стретчинг і дихання",
  },
  {
    id: "booking-4",
    name: "Андрій Шевченко",
    phone: "+380501234567",
    comment: "Бронь для відновлення спини після навантаження.",
    status: "pending",
    ownerEmail: "user1@gmail.com",
    date: "2026-04-01",
    time: "10:15",
    eventTitle: "Йога для спини",
  },
  {
    id: "booking-5",
    name: "Катерина Мельник",
    phone: "+380501234567",
    comment: "Записуюсь на групову практику ввечері.",
    status: "approve",
    ownerEmail: "user1@gmail.com",
    date: "2026-04-02",
    time: "19:00",
    eventTitle: "Групова практика",
  },
];
