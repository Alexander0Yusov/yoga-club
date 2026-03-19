import { z } from "zod";

import { entityLifecycleSchema } from "@/modules/_shared/contracts/entityLifecycle";

export const SectionSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    landingIndex: z.number().int(),
    content: z.record(z.string(), z.unknown()),
  })
  .extend(entityLifecycleSchema.shape);

export type SectionContract = z.infer<typeof SectionSchema>;
