import { z } from "zod";

export const DemoVideoSchema = z.object({
  slug: z.string().min(1),
  isFeatured: z.boolean(),
  landingIndex: z.number().int(),
  title: z.string().min(1),
  url: z.string().min(1),
});

export type DemoVideoContract = z.infer<typeof DemoVideoSchema>;
