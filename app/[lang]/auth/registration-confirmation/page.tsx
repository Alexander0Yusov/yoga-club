import type { LocaleT } from "@/i18nConfig";
import { PanelSignForm } from "@/features/auth/ui/PanelSignForm";
import RegistrationConfirmationGate from "@/features/auth/ui/RegistrationConfirmationGate";

type PageProps = {
  params: { lang: LocaleT };
  searchParams?: { code?: string };
};

export default function RegistrationConfirmationPage({
  params,
  searchParams,
}: PageProps) {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-10">
      <PanelSignForm className="w-full max-w-2xl">
        <RegistrationConfirmationGate
          lang={params.lang}
          code={searchParams?.code}
        />
      </PanelSignForm>
    </div>
  );
}
