import { z } from "zod";

import { entityLifecycleSchema } from "@/modules/_shared/contracts/entityLifecycle";
import { isoUtcDateTime } from "@/modules/_shared/contracts/isoUtcDateTime";

export const FeedbackSchema = z
  .object({
    isFeatured: z.boolean(),
    name: z.string().min(1),
    text: z.string().min(1),
    date: isoUtcDateTime,
    url: z.string().min(1).optional(),
  })
  .extend(entityLifecycleSchema.shape);

export type FeedbackContract = z.infer<typeof FeedbackSchema>;
