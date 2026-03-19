import { z } from "zod";

import { entityLifecycleSchema } from "@/modules/_shared/contracts/entityLifecycle";

export const PracticeBenefitSchema = z
  .object({
    landingIndex: z.number().int(),
    text: z.string().min(1),
    slavefield: z.string().optional(),
  })
  .extend(entityLifecycleSchema.shape);

export type PracticeBenefitContract = z.infer<typeof PracticeBenefitSchema>;
