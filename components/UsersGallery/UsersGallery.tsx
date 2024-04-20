"use client";

import React, { useEffect, useState } from "react";
import UsersItem from "../UsersItem/UsersItem";

const UsersGallery = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const result = await fetch("/api/usersAll");

      if (result.ok) {
        const res = await result.json();
        setUsers(res);
      }
    };

    getUsers();
  }, []);

  return (
    <table className="table-auto w-full my-[20px]">
      <thead>
        <tr className=" h-[40px]">
          <th>№</th>
          <th>Дата реєстрації</th>
          <th>Фото</th>
          <th>Аватар</th>
          <th>Ім'я</th>
          <th>Ім'я аватара</th>
          <th>Номер телефону</th>
          <th>Електронна пошта</th>
          <th>Підписка</th>
          <th>Ч. список</th>
        </tr>
      </thead>
      <tbody>
        {users.map(
          (
            {
              _id,
              createdAt,
              image,
              portrait,
              name,
              nickname,
              phone,
              email,
              isSubscribed,
              isInBlacklist,
            },
            index
          ) => (
            <UsersItem
              key={_id}
              num={index}
              createdAt={createdAt}
              image={image}
              portrait={portrait}
              name={name}
              nickname={nickname}
              phone={phone}
              email={email}
              isSubscribed={isSubscribed}
              isInBlacklist={isInBlacklist}
            />
          )
        )}
      </tbody>
    </table>
  );
};

export default UsersGallery;

// let obj = {
//   createdAt: "2024-01-27T04:24:54.230Z",
//   email: "yusovsky2@gmail.com",
//   emailVerified: null,
//   image:
//     "https://lh3.googleusercontent.com/a/ACg8ocIlz_EqTRgcg8u6_LHFZvni52aYSxIZd_lDJ8g1Ii7D=s96-c",
//   isAdmin: false,
//   isInBlacklist: false,
//   isSubscribed: true,
//   name: "Александр Юсов",
//   nickname: "Вітя",
//   phone: "",
//   portrait:
//     "https://res.cloudinary.com/dwgi8qlph/image/upload/v1706330171/yoga-club/avatars/65930799b738693fbe86bb78.jpg",
//   updatedAt: "2024-01-27T04:36:11.633Z",
//   userEmail: "yusovsky2@gmail.com",
//   userId: "65930799b738693fbe86bb78",
//   _id: "65930799b738693fbe86bb78",
// };
