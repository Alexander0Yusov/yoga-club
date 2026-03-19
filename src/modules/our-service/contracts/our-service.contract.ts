import { z } from "zod";

export const OurServiceSchema = z.object({
  slug: z.string().min(1),
  landingIndex: z.number().int(),
  title: z.string().min(1),
  text: z.string().min(1),
  url: z.string().min(1),
});

export type OurServiceContract = z.infer<typeof OurServiceSchema>;
