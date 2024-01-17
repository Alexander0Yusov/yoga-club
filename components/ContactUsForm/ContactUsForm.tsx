"use client";

const ContactUsForm = () => {
  const handlerSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const response = await fetch("/api/telegram", {
      method: "POST",
      body: formData,
    });

    console.log("tg: ", response.ok);
  };

  return (
    <form onSubmit={handlerSubmit} className="border-[1px] border-orange-700">
      <div className="flex w-full justify-between">
        <div className=" w-[683px]">
          <label className="block mb-[12px] text-fs16 border-[1px] border-orange-700">
            Прізвище та Ім’я
            <input
              name="name"
              className="w-full h-[60px] px-[8px] mt-[8px] rounded-[10px] border-[1px] border-lilac"
              type="text"
              placeholder="Іван Іванов"
            />
          </label>

          <label className="block mb-[12px] text-fs16 border-[1px] border-orange-700">
            Електронна пошта
            <input
              name="email"
              className="w-full h-[60px] px-[8px] mt-[8px] rounded-[10px] border-[1px] border-lilac"
              type="email"
              placeholder="abcd@efgh.mail"
            />
          </label>

          <label className="block text-fs16 border-[1px] border-orange-700">
            Телефон
            <input
              name="phone"
              className="w-full h-[60px] px-[8px] mt-[8px] rounded-[10px] border-[1px] border-lilac"
              type="text"
              placeholder="+380991234567"
            />
          </label>
        </div>

        <div className="flex flex-col justify-between w-[683px] ">
          <label className=" ">
            Коментар
            <textarea
              name="textarea"
              className=" w-full h-[208px] p-[8px] mt-[4px] resize-none rounded-[10px] border-[1px] border-lilac caret-black "
            />
          </label>

          <label className="cursor-pointer flex flex-row-reverse justify-end ">
            <span className=" text-fs16">
              Згода на обробку персональних даних
            </span>
            <input className=" mr-[8px] " type="checkbox" />
          </label>
        </div>
      </div>

      {/* <LinkAncor href={""}>Записатись</LinkAncor> */}

      <button
        className="block w-[250px] h-[50px] ml-auto mt-[32px] bg-brown-light-light border-[2px] border-localbrown rounded-full"
        type="submit"
      >
        Отправить заявку
      </button>
    </form>
  );
};

export default ContactUsForm;
