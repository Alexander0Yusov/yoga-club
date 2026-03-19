import { z } from "zod";

import { isoUtcDateTime } from "@/modules/_shared/contracts/isoUtcDateTime";

export const MyEventSchema = z.object({
  slug: z.string().min(1),
  isFeatured: z.boolean(),
  landingIndex: z.number().int(),
  title: z.string().min(1),
  text: z.string().min(1),
  targetDate: isoUtcDateTime,
  url: z.array(z.string().min(1)),
});

export type MyEventContract = z.infer<typeof MyEventSchema>;
