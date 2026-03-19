import { z } from "zod";

import { entityLifecycleSchema } from "@/modules/_shared/contracts/entityLifecycle";

export const AboutMeSideSchema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
  url: z.string().optional(),
});

export const AboutMeSchema = z
  .object({
    pairIndex: z.number().int(),
    slug: z.string().min(1),
    // Если есть title или text, UI показывает их вместо url на этой стороне.
    left: AboutMeSideSchema,
    right: AboutMeSideSchema,
  })
  .extend(entityLifecycleSchema.shape);

export type AboutMeContract = z.infer<typeof AboutMeSchema>;
