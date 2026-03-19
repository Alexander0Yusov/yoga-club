import { z } from "zod";

const clubContactProviderValues = [
  "TELEGRAM",
  "WHATSAPP",
  "INSTAGRAM",
  "FACEBOOK",
  "YOUTUBE",
  "VIBER",
  "TIKTOK",
  "LINKEDIN",
  "OTHER",
] as const;

const clubContactLocationDataSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  house: z.string().optional(),
  office: z.string().optional(),
});

const clubContactBaseSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
  provider: z.enum(clubContactProviderValues),
  isActive: z.boolean(),
  landingIndex: z.number().int(),
});

const clubContactLocationSchema = clubContactBaseSchema.extend({
  type: z.literal("LOCATION"),
  locationData: clubContactLocationDataSchema.optional(),
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
