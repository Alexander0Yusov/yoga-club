export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

export interface User {
  email: string;
  role: UserRole;

  telephone?: string;
  isSubscribed?: boolean;
  lang?: string;
  isInBlacklist?: boolean;

  name?: string;
  imgUrl?: string;
  platformName?: string;
  platformImgUrl?: string;
}
