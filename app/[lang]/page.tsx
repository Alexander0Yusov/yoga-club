import LandingSections from "@/widgets/landing-sections/LandingSections";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LangPage({
  params,
}: {
  params: { lang: string };
}) {
  return <LandingSections lang={params.lang} />;
}
