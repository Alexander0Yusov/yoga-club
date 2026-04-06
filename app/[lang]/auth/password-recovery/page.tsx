import type { LocaleT } from "@/i18nConfig";
import { PanelSignForm } from "@/features/auth/ui/PanelSignForm";
import PasswordRecoveryForm from "@/features/auth/ui/PasswordRecoveryForm";

type PageProps = {
  params: { lang: LocaleT };
  searchParams?: { recoveryCode?: string };
};

export default function PasswordRecoveryPage({
  params,
  searchParams,
}: PageProps) {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-10">
      <PanelSignForm className="w-full max-w-2xl">
        <PasswordRecoveryForm
          lang={params.lang}
          recoveryCode={searchParams?.recoveryCode}
        />
      </PanelSignForm>
    </div>
  );
}
