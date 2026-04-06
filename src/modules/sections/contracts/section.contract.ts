import { z } from "zod";

import { entityLifecycleSchema } from "@/modules/_shared/contracts/entityLifecycle";
import { localizedTextSchema } from "@/modules/_shared/contracts/localizedText";

export const sectionContentTypeSchema = z.enum([
  "reviews",
  "videos",
  "advantages",
  "practice_benefits",
  "club_events",
  "about_me_cards",
  "hero_intro",
  "yoga_directions",
  "bookings",
  "event_refs_panel",
]);

export const SectionSchema = z
  .object({
    _id: z.string().min(1),
    title: localizedTextSchema,
    subtitle_1: localizedTextSchema.optional(),
    subtitle_2: localizedTextSchema.optional(),
    for: sectionContentTypeSchema,
    orderIndex: z.number().int(),
  })
  .extend(entityLifecycleSchema.shape);

export type SectionContract = z.infer<typeof SectionSchema>;
export type SectionContentType = z.infer<typeof sectionContentTypeSchema>;

