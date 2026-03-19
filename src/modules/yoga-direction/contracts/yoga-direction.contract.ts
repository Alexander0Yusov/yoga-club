import { z } from "zod";

import { entityLifecycleSchema } from "@/modules/_shared/contracts/entityLifecycle";

export const YogaDirectionSchema = z
  .object({
    slug: z.string().min(1),
    landingIndex: z.number().int(),
    title: z.string().min(1),
    text: z.string().min(1),
    url: z.string().min(1),
  })
  .extend(entityLifecycleSchema.shape);

export type YogaDirectionContract = z.infer<typeof YogaDirectionSchema>;
