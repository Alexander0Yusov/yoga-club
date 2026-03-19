import { z } from "zod";

const userRoleValues = ["USER", "ADMIN", "SUPERADMIN"] as const;

export const UserRoleSchema = z.enum(userRoleValues);

export const UserSchema = z.object({
  email: z.string().email(),
  role: UserRoleSchema,
  // Режим предпросмотра не меняет реальную backend-роль.
  viewMode: UserRoleSchema.optional(),
  telephone: z.string().optional(),
  isSubscribed: z.boolean().optional(),
  isInBlacklist: z.boolean().optional(),
  name: z.string().optional(),
  imgUrl: z.string().optional(),
  platformName: z.string().optional(),
  platformImgUrl: z.string().optional(),
});

export type UserContract = z.infer<typeof UserSchema>;
