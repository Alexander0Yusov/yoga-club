import { NextRequest, NextResponse } from "next/server";

import { GOOGLE_AUTH_LANG_COOKIE_NAME } from "@/shared/auth/google-auth-lang-cookie";
import { LANG_SYNCED_COOKIE_NAME } from "@/shared/i18n/locale";

function readCredential(formData: FormData | URLSearchParams) {
  return (
    formData.get("credential")?.toString() ||
    formData.get("idToken")?.toString() ||
    formData.get("id_token")?.toString() ||
    formData.get("code")?.toString() ||
    ""
  );
}

function readLang(request: NextRequest) {
  const syncedLangCookie = request.cookies.get(LANG_SYNCED_COOKIE_NAME)?.value;
  const langCookie = request.cookies.get(GOOGLE_AUTH_LANG_COOKIE_NAME)?.value;
  const queryLang = request.nextUrl.searchParams.get("lang");
  const lang = (syncedLangCookie || langCookie || queryLang || "en")
    .toLowerCase()
    .slice(0, 2);

  return ["en", "ru", "uk", "de"].includes(lang) ? lang : "en";
}

function redirectToLangCallback(
  request: NextRequest,
  lang: string,
  credential: string,
) {
  const url = new URL(`/${lang}/api/auth/callback/google`, request.url);
  url.searchParams.set("credential", credential);

  return NextResponse.redirect(url, { status: 303 });
}

async function extractCredential(request: NextRequest): Promise<string> {
  if (request.method === "POST") {
    const formData = await request.formData().catch(() => null);

    if (!formData) {
      return "";
    }

    return readCredential(formData);
  }

  return readCredential(request.nextUrl.searchParams);
}

async function handleCallback(request: NextRequest) {
  const lang = readLang(request);
  const credential = await extractCredential(request);

  const response = credential
    ? redirectToLangCallback(request, lang, credential)
    : NextResponse.redirect(
        new URL(`/${lang}/signin?googleError=1`, request.url),
        { status: 303 },
      );

  response.cookies.set({
    name: GOOGLE_AUTH_LANG_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function GET(request: NextRequest) {
  return handleCallback(request);
}

export async function POST(request: NextRequest) {
  return handleCallback(request);
}
