import { z } from "zod";

import { isoUtcDateTime } from "@/modules/_shared/contracts/isoUtcDateTime";

// Базовые поля жизненного цикла для всех сущностей.
export const entityLifecycleSchema = z.object({
  isActive: z.boolean(),
  deletedAt: z.union([isoUtcDateTime, z.null()]),
});

export type EntityLifecycleContract = z.infer<typeof entityLifecycleSchema>;
