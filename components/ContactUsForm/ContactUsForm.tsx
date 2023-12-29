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
        <div>
          <label className="flex flex-col mb-[30px]">
            Прізвище та Ім’я
            <input
              name="name"
              className="h-[60px]"
              type="text"
              placeholder="Іван Іванов"
            />
          </label>

          <label className="flex flex-col mb-[30px]">
            Електронна пошта
            <input
              name="email"
              className="h-[60px]"
              type="email"
              placeholder="abcd@efgh.mail"
            />
          </label>

          <label className="flex flex-col">
            Телефон
            <input
              name="phone"
              className="h-[60px]"
              type="text"
              placeholder="+380991234567"
            />
          </label>
        </div>

        <div className="w-[185px]">
          <label className="flex flex-col ">
            Коментар
            <textarea
              name="textarea"
              className=" h-[220px] px-1 resize-none rounded-[10px] caret-black font-mulish"
            />
          </label>

          <label className="cursor-pointer flex flex-row-reverse">
            <span>Згода на обробку персональних даних</span>
            <input className=" " type="checkbox" />
          </label>
        </div>
      </div>

      <button
        className="block w-[250px] h-[50px] mx-auto border-[2px] border-black rounded-full"
        type="submit"
      >
        Отправить заявку
      </button>
    </form>
  );
};

export default ContactUsForm;
