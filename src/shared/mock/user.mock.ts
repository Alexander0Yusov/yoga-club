import type { User } from "@/entities/user/model/types";

export const userMock: User = {
  email: "anna.petrenko@yogaclub.com",
  role: "USER",
  name: "Anna Petrenko",
  telephone: "+380 67 123 45 67",
  isSubscribed: true,
};

export const usersMock: User[] = [
  userMock,
  {
    email: "admin@yogaclub.com",
    role: "ADMIN",
    name: "Iryna Shevchenko",
    telephone: "+380 50 987 65 43",
    isSubscribed: true,
  },
  {
    email: "superadmin@yogaclub.com",
    role: "SUPERADMIN",
    name: "Olena Kovalenko",
    telephone: "+380 93 555 12 12",
    isSubscribed: false,
  },
];
