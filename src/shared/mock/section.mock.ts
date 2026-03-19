import type { Section } from "@/entities/section/model/types";

export const sectionMock: Section[] = [
  { name: "Hero", landingIndex: 1 },
  { name: "Practice Benefits", landingIndex: 2 },
  { name: "Yoga Directions", landingIndex: 3 },
  { name: "About the Instructor", landingIndex: 4 },
  { name: "Services", landingIndex: 5 },
  { name: "Contact", landingIndex: 6 },
];

export const landingSectionNames = sectionMock.map((section) => section.name);
