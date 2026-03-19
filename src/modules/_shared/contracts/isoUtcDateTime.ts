import { z } from "zod";

export const isoUtcDateTime = z
  .string()
  .datetime({ offset: true })
  .refine((value) => value.endsWith("Z"), {
    message: "Must be ISO UTC with Z suffix",
  });

export type IsoUtcDateTime = z.infer<typeof isoUtcDateTime>;
