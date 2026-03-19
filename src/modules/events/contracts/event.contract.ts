import { z } from "zod";

import { isoUtcDateTime } from "@/modules/_shared/contracts/isoUtcDateTime";

export const EventSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  date: isoUtcDateTime,
  location: z.string().min(1),
  price: z.union([z.string(), z.number()]),
  imageUrl: z.string().min(1),
  isFeatured: z.boolean(),
  landingIndex: z.number().int(),
});

export type EventContract = z.infer<typeof EventSchema>;
