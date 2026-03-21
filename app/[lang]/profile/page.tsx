import AuthTrigger from "@/components/AuthTrigger/AuthTrigger";
import ProfileForm from "@/components/ProfileForm/ProfileForm";
import UserBlock from "@/components/UserBlock/UserBlock";
import { authConfig } from "@/configs/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const ProfilePage = async ({ params }: { params: { lang: string } }) => {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect(`/${params.lang}/signin`);
  }

  return (
    <section className=" py-[60px] ">
      {/* <AuthTrigger /> */}

      <ProfileForm />
    </section>
  );
};

export default ProfilePage;
