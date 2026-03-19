import { z } from "zod";

import { entityLifecycleSchema } from "@/modules/_shared/contracts/entityLifecycle";
import { isoUtcDateTime } from "@/modules/_shared/contracts/isoUtcDateTime";

export const MyEventSchema = z
  .object({
    slug: z.string().min(1),
    isFeatured: z.boolean(),
    landingIndex: z.number().int(),
    title: z.string().min(1),
    text: z.string().min(1),
    targetDate: isoUtcDateTime,
    url: z.array(z.string().min(1)),
  })
  .extend(entityLifecycleSchema.shape);

export type MyEventContract = z.infer<typeof MyEventSchema>;
