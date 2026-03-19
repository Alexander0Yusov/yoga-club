import { z } from "zod";

export const HeroIntroSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export type HeroIntroContract = z.infer<typeof HeroIntroSchema>;
