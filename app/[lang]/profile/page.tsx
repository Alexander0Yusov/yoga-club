import AuthTrigger from "@/components/AuthTrigger/AuthTrigger";
import UserBlock from "@/components/UserBlock/UserBlock";
import { authConfig } from "@/configs/auth";
import { getServerSession } from "next-auth";

const Profile = async () => {
  const session = await getServerSession(authConfig);

  return (
    <section className="flex flex-col justify-center items-center border-[1px] border-orange-950 py-[20px]">
      <h2>Profile</h2>
      <AuthTrigger />
      {session?.user && <UserBlock />}
    </section>
  );
};

export default Profile;
