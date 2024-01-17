"use client";

import Image from "next/image";
import { useState } from "react";
import ProfileForm from "../ProfileForm/ProfileForm";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UserBlock = ({}) => {
  const [admin, setAdmin] = useState(false);
  const path = usePathname();

  return (
    <section>
      {/* <div id="adminTabs"> */}
      {/* <button
          type="button"
          className="flex justify-center items-center w-full h-[50px] border-[1px] border-lime-400 mt-[20px] rounded-lg font-medium"
          onClick={() => setAdmin(!admin)}
          style={{
            backgroundColor: admin ? "rgb(167 243 208)" : "rgb(186 230 253)",
          }}
        > */}
      {/* Admin mode */}
      {/* статус админа можно хранить в контексте и переключать его как тему, сохранять в локалсторедж */}
      {/* </button> */}

      {/* <div className="flex gap-2">
          <Link
            href="/profile/users"
            className={path === "/users" ? "active" : ""}
          >
            Users
          </Link>

          <Link
            href="/profile/statistics"
            className={path === "/statistics" ? "active" : ""}
          >
            Statistics
          </Link>

          <Link
            href="/profile/feedbacks"
            className={path === "/feedbacks" ? "active" : ""}
          >
            Feedbacks
          </Link>
        </div> */}
      {/* </div> */}

      <div className="border-[1px] border-orange-950 py-[20px]">
        <ProfileForm />
      </div>
    </section>
  );
};

export default UserBlock;
