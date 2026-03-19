import { z } from "zod";

const aboutMeSideSchema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
  url: z.string().optional(),
});

export const AboutMeSchema = z.object({
  pairIndex: z.number().int(),
  slug: z.string().min(1),
  // Если есть title или text, UI показывает их вместо url на этой стороне.
  left: aboutMeSideSchema,
  right: aboutMeSideSchema,
});

export type AboutMeContract = z.infer<typeof AboutMeSchema>;
