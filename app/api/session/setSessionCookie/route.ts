import { decode, encode } from "@/lib/encryption";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { refreshTokenExpires, accessTokenExpires, data } = await req.json();
  try {
    cookies().set("session-data", data, { secure: true });
    cookies().set("accessTokenExpires", accessTokenExpires);
    cookies().set("refreshTokenExpires", refreshTokenExpires);
    return NextResponse.json({});
  } catch {
    return NextResponse.json(0);
  }
}
