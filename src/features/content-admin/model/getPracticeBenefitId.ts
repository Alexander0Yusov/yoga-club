import type { PracticeBenefitRecord } from "@/shared/api/client";

export function getPracticeBenefitId(
  practiceBenefit?: PracticeBenefitRecord | null
): string | undefined {
  return practiceBenefit?.id || practiceBenefit?._id;
}
