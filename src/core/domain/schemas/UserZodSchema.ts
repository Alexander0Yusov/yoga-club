import { z } from "zod";

// Если ты используешь перечисления для ролей
export enum ROLES {
  USER = "user",
  ADMIN = "admin",
  SUPERADMIN = "superadmin",
}

export const UserZodSchema = z.object({
  // Валидируем как строку, но можно добавить проверку на длину ObjectId (24 символа)
  id: z.string().or(z.any()),

  name: z
    .string()
    .min(2, "Имя должно быть не короче 2 символов")
    .max(50, "Имя слишком длинное"),

  email: z.string().email("Некорректный формат email"),

  passwordHash: z.string().min(8, "Хеш пароля слишком короткий"),

  image: z.string().url("Ссылка на изображение некорректна").or(z.literal("")), // Позволяет пустую строку, если фото нет

  role: z.nativeEnum(ROLES),

  isInBlacklist: z.boolean().default(false),

  isSubscribed: z.boolean().default(false),

  isEmailVerified: z.boolean().default(false),

  emailVerificationCode: z.string().nullable().default(null),

  createdAt: z.date().or(z.string().datetime()), // Принимает и объект Date, и ISO-строку
  updatedAt: z.date().or(z.string().datetime()).nullable(),
  deletedAt: z.date().or(z.string().datetime()).nullable().default(null),
});

// Автоматическое извлечение типа из схемы
export type UserType = z.infer<typeof UserZodSchema>;
