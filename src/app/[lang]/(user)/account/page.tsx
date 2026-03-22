import { authConfig } from "@/configs/auth";
import AccountDashboard from "@/features/account/ui/AccountDashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const AccountPage = async ({ params }: { params: { lang: string } }) => {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect(`/${params.lang}/signin`);
  }

  return <AccountDashboard />;
};

export default AccountPage;
