import { authConfig } from "@/configs/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";

const Profile = async () => {
  const session = await getServerSession(authConfig);

  return (
    <section className="flex flex-col justify-center items-center border-[1px] border-orange-950 py-[20px]">
      <h2>Profile</h2>

      <p>{session?.user?.name}</p>
      <p>{session?.user?.email}</p>

      {session?.user?.image && (
        <div className="border-[1px] border-orange-950 w-[100px] h-[100px]">
          <Image
            src={session?.user?.image as string}
            width={100}
            height={100}
            alt="User portrait"
          />
        </div>
      )}
    </section>
  );
};

export default Profile;
