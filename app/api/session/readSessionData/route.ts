import { decode } from "@/lib/encryption";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { sessionData } = await req.json();
  const {
    username,
    email,
    _jwtAccessToken,
    _jwtRefreshToken,
    accessTokenExpires,
    refreshTokenExpires,
    pfp,
    follows
  } = decode(sessionData);
  return NextResponse.json({
    username,
    email,
    accessTokenExpires,
    refreshTokenExpires,
    pfp,
    follows
  });
}
