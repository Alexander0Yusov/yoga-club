import type { Section } from "@/entities/section/model/types";

export function sortByLandingIndex(sections: Section[]): Section[] {
  return [...sections].sort((left, right) => left.landingIndex - right.landingIndex);
}
