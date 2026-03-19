import { z } from "zod";

export const SectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  landingIndex: z.number().int(),
  isActive: z.boolean(),
  content: z.record(z.string(), z.any()),
});

export type SectionContract = z.infer<typeof SectionSchema>;
