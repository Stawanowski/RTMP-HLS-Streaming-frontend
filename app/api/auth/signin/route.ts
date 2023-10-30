import { addDaysToDate } from "@/lib/dateExpires";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decode, encode } from "@/lib/encryption";
export async function POST(request: Request) {
  const { accessToken, refreshToken, username, email, pfp } = await request.json();
  if (!username || !accessToken || !refreshToken || !email) {
    return NextResponse.json("Fail");
  }
  try {
    const now = new Date();
    const { refreshTokenExpires, accessTokenExpires } = {
      refreshTokenExpires: addDaysToDate(now, 7),
      accessTokenExpires: addDaysToDate(now, 1),
    };
    const payload = {
      accessToken,
      refreshToken,
      username,
      email,
      refreshTokenExpires,
      accessTokenExpires,
      pfp
    };
    const encryptedPayload = encode(payload);
    cookies().set("refreshTokenExpires", refreshTokenExpires.toDateString());
    cookies().set("accessTokenExpires", accessTokenExpires.toDateString());
    cookies().set("session-data", encryptedPayload);
    return NextResponse.json("Success");
  } catch {
    return NextResponse.json("Fail");
  }
}
