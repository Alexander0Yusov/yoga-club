import { z } from "zod";

export const localizedTextSchema = z.object({
  ru: z.string().min(1),
  en: z.string().optional(),
  de: z.string().optional(),
  uk: z.string().optional(),
});

export type LocalizedTextContract = z.infer<typeof localizedTextSchema>;

