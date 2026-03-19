import { z } from "zod";

import { entityLifecycleSchema } from "@/modules/_shared/contracts/entityLifecycle";

export const DemoVideoSchema = z
  .object({
    slug: z.string().min(1),
    isFeatured: z.boolean(),
    landingIndex: z.number().int(),
    title: z.string().min(1),
    url: z.string().min(1),
  })
  .extend(entityLifecycleSchema.shape);

export type DemoVideoContract = z.infer<typeof DemoVideoSchema>;
