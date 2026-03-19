import { z } from "zod";

import { entityLifecycleSchema } from "@/modules/_shared/contracts/entityLifecycle";

export const HeroIntroSchema = z
  .object({
    name: z.string().min(1),
    value: z.string().min(1),
  })
  .extend(entityLifecycleSchema.shape);

export type HeroIntroContract = z.infer<typeof HeroIntroSchema>;
