import { z } from "zod";

import { entityLifecycleSchema } from "@/modules/_shared/contracts/entityLifecycle";
import { localizedTextSchema } from "@/modules/_shared/contracts/localizedText";

const localizedImageSchema = z
  .object({
    url: z.string().min(1),
    alt: localizedTextSchema.optional(),
    publicId: z.string().optional(),
  })
  .optional();

export const PracticeBenefitSchema = z
  .object({
    id: z.string().min(1),
    text_1: localizedTextSchema,
    text_2: localizedTextSchema.optional(),
    text_3: localizedTextSchema.optional(),
    text_4: localizedTextSchema.optional(),
    text_5: localizedTextSchema.optional(),
    text_6: localizedTextSchema.optional(),
    text_7: localizedTextSchema.optional(),
    text_8: localizedTextSchema.optional(),
    text_9: localizedTextSchema.optional(),
    text_10: localizedTextSchema.optional(),
    image: localizedImageSchema,
  })
  .extend(entityLifecycleSchema.shape);

export type PracticeBenefitContract = z.infer<typeof PracticeBenefitSchema>;
