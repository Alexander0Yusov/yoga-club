import { ObjectId } from "mongoose";
import { ROLES, UserZodSchema } from "../schemas/UserZodSchema";
import z from "zod";

// export interface UserEntity {
//   id: ObjectId;
//   name: string;
//   email: string;
//   passwordHash: string;
//   image: string;
//   role: ROLES;
//   isInBlacklist: boolean;
//   isSubscribed: boolean;
//   isEmailVerified: boolean;
//   emailVerificationCode: string | null;
//   createdAt: Date;
//   deletedAt: Date | null;
//   updatedAt: Date | null;
// }

export interface UserEntity extends z.infer<typeof UserZodSchema> {}
