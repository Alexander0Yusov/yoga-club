import { z } from "zod";

export const PracticeBenefitSchema = z.object({
  landingIndex: z.number().int(),
  text: z.string().min(1),
  slavefield: z.string().optional(),
});

export type PracticeBenefitContract = z.infer<typeof PracticeBenefitSchema>;
