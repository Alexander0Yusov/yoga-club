import type { HeroIntroRecord } from "@/shared/api/client";

export function getHeroIntroId(heroIntro?: HeroIntroRecord | null): string | undefined {
  return heroIntro?.id;
}
