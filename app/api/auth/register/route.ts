import { addDaysToDate } from "@/lib/dateExpires";
import axios from "axios";
import { NextResponse } from "next/server";
import { encode } from "@/lib/encryption";
import { cookies } from "next/headers";

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
    const payload: any = {
      accessToken,
      refreshToken,
      username,
      email,
      refreshTokenExpires,
      accessTokenExpires,
      pfp
    };
    const data = encode(payload);
    cookies().set("refreshTokenExpires", refreshTokenExpires.toDateString());
    cookies().set("accessTokenExpires", accessTokenExpires.toDateString());
    cookies().set("session-data", data);
    return NextResponse.json("Success");
  } catch {
    return NextResponse.json("Fail");
  }
}
