import { NextResponse } from "next/server";

const { TG_API_KEY, TG_CHAT_ID } = process.env;

export const POST = async (req: Request) => {
  let { name, phone, email, comment } = await req.json();

  let message = "<b>Повідомлення з сайту:</b>\n";

  if (name) {
    message += `Ім'я: ${name}\n`;
  }

  if (phone) {
    message += `Телефон: ${phone}\n`;
  }

  if (email) {
    message += `Ел. пошта: ${email}\n`;
  }

  if (comment) {
    message += `Текст: ${comment}\n`;
  }

  // https://api.telegram.org/bot<TG_API_KEY>/getUpdates
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
