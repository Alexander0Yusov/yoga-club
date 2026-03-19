import { z } from "zod";

import { entityLifecycleSchema } from "@/modules/_shared/contracts/entityLifecycle";

export const ClubContactTypeSchema = z.enum(["SOCIAL", "PHONE", "EMAIL", "LOCATION"]);
export const ClubContactProviderSchema = z.enum([
  "TELEGRAM",
  "WHATSAPP",
  "INSTAGRAM",
  "FACEBOOK",
  "YOUTUBE",
  "VIBER",
  "TIKTOK",
  "LINKEDIN",
  "OTHER",
]);

export const ClubContactLocationDataSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  house: z.string().optional(),
  office: z.string().optional(),
});

const clubContactBaseSchema = z
  .object({
    name: z.string().min(1),
    value: z.string().min(1),
    provider: ClubContactProviderSchema,
    landingIndex: z.number().int(),
  })
  .extend(entityLifecycleSchema.shape);

const clubContactLocationSchema = clubContactBaseSchema.extend({
  type: z.literal("LOCATION"),
  locationData: ClubContactLocationDataSchema.optional(),
});

const clubContactNonLocationSchema = clubContactBaseSchema.extend({
  type: z.enum(["SOCIAL", "PHONE", "EMAIL"]),
  locationData: z.never().optional(),
});

export const ClubContactSchema = z.union([
  clubContactLocationSchema,
  clubContactNonLocationSchema,
]);

export type ClubContactContract = z.infer<typeof ClubContactSchema>;
