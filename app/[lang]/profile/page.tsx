import AuthTrigger from "@/components/AuthTrigger/AuthTrigger";
import ProfileForm from "@/components/ProfileForm/ProfileForm";
import UserBlock from "@/components/UserBlock/UserBlock";
import { authConfig } from "@/configs/auth";
import { getServerSession } from "next-auth";

const ProfilePage = async () => {
  const session = await getServerSession(authConfig);

  return (
    <section className=" py-[60px] ">
      {/* <AuthTrigger /> */}

      <ProfileForm />
    </section>
  );
};

export default ProfilePage;
