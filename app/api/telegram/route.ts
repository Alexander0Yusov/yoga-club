import { NextResponse } from "next/server";

const { TG_API_KEY, TG_CHAT_ID } = process.env;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export const POST = async (req: Request) => {
  if (!TG_API_KEY || !TG_CHAT_ID) {
    return NextResponse.json(
      { error: { message: "Telegram bot is not configured" } },
      { status: 500 },
    );
  }

  const payload = (await req.json()) as {
    name?: string;
    phone?: string;
    email?: string;
    comment?: string;
  };

  let message = "<b>Повідомлення з сайту:</b>\n";

  if (payload.name) {
    message += `Ім'я: ${escapeHtml(payload.name)}\n`;
  }

  if (payload.phone) {
    message += `Телефон: ${escapeHtml(payload.phone)}\n`;
  }

  if (payload.email) {
    message += `Ел. пошта: ${escapeHtml(payload.email)}\n`;
  }

  if (payload.comment) {
    message += `Текст: ${escapeHtml(payload.comment)}\n`;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TG_API_KEY}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: Number(TG_CHAT_ID),
          text: message,
          parse_mode: "HTML",
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return NextResponse.json(
        {
          error: {
            message: errorText || "Failed to send Telegram message",
          },
        },
        { status: response.status },
      );
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Telegram error";
    return NextResponse.json(
      { error: { message } },
      { status: 500 },
    );
  }
};
