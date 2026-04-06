import type { LocaleT } from "@/i18nConfig";
import { PanelSignForm } from "@/features/auth/ui/PanelSignForm";
import GoogleCallbackGate from "@/features/auth/ui/GoogleCallbackGate";

type PageProps = {
  params: { lang: LocaleT };
  searchParams?: {
    credential?: string;
    code?: string;
    idToken?: string;
    callbackUrl?: string;
  };
};

export default function GoogleCallbackPage({
  params,
  searchParams,
}: PageProps) {
  const credential =
    searchParams?.credential || searchParams?.idToken || searchParams?.code;

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-10">
      <PanelSignForm className="w-full max-w-xl">
        <GoogleCallbackGate
          lang={params.lang}
          credential={credential}
          callbackUrl={searchParams?.callbackUrl}
        />
      </PanelSignForm>
    </div>
  );
}

