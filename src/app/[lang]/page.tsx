import LandingSections from "@/widgets/landing-sections/LandingSections";

export default function LangPage({
  params,
}: {
  params: { lang: string };
}) {
  return <LandingSections lang={params.lang} />;
}
