import { z } from "zod";

import { entityLifecycleSchema } from "@/modules/_shared/contracts/entityLifecycle";
import { isoUtcDateTime } from "@/modules/_shared/contracts/isoUtcDateTime";

export const FeedbackSchema = z
  .object({
    authorName: z.string().min(1),
    avatarUrl: z.string().url().or(z.literal("")).optional(),
    comment: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    date: isoUtcDateTime,
    userId: z.string().optional(),
    userInfoId: z.string().optional(),
  })
  .extend(entityLifecycleSchema.shape);

export type FeedbackContract = z.infer<typeof FeedbackSchema>;
