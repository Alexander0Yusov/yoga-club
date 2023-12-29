import { NextResponse } from "next/server";

const { TG_API_KEY, TG_CHAT_ID } = process.env;

export const POST = async (req: Request) => {
  let formData: any;
  try {
    formData = await req.formData();
  } catch (error) {
    return Response.json(error);
  }

  let message = "<b>Повідомлення з сайту:</b>\n";

  const name = formData.get("name");
  if (name) {
    message += `Ім'я: ${name}\n`;
  }
  const phone = formData.get("phone");
  if (phone) {
    message += `Телефон: ${phone}\n`;
  }
  const email = formData.get("email");
  if (email) {
    message += `Ел. пошта: ${email}\n`;
  }
  const textarea = formData.get("textarea");
  if (textarea) {
    message += `Текст: ${textarea}\n`;
  }

  try {
    const URI_API = `https://api.telegram.org/bot${TG_API_KEY}/sendMessage`;
    const response = await fetch(URI_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: Number(TG_CHAT_ID),
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (response.ok) {
      return NextResponse.json({ status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
};
