import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AccountDashboard from "@/features/account/ui/AccountDashboard";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/auth/access-token-cookie";
import { fetchBackendMe } from "@/shared/auth/backend-session";

const AccountPage = async ({ params }: { params: { lang: string } }) => {
  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    redirect(`/${params.lang}/signin`);
  }

  try {
    await fetchBackendMe({
      accessToken,
      locale: params.lang,
    });
  } catch {
    // Якщо access token протух, даємо клієнту шанс тихо оновити сесію через refresh.
  }

  return <AccountDashboard lang={params.lang} />;
};

export default AccountPage;
