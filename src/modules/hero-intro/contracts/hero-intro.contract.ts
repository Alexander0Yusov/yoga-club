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

export const HeroIntroSchema = z
  .object({
    _id: z.string().min(1),
    title: localizedTextSchema,
    text1: localizedTextSchema,
    text2: localizedTextSchema,
    image: localizedImageSchema,
  })
  .extend(entityLifecycleSchema.shape);

export type HeroIntroContract = z.infer<typeof HeroIntroSchema>;

