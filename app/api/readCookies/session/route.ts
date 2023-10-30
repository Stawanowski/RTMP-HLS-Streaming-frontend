import { decode } from "@/lib/encryption";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  let userData: any = cookies().get("session-data");
  if (!userData?.value || userData?.value == "undefined") {
    return NextResponse.json(encodeURIComponent("undefined"));
  }
  const decoded = await decode(userData.value)
  console.log
  let refreshTokenExpires: any = decoded.refreshTokenExpires;
  let accessTokenExpires: any = decoded.accessTokenExpires;
  // console.log(decoded, refreshTokenExpires, encodeURIComponent(accessTokenExpires))
  return NextResponse.json({
    userData: encodeURIComponent(userData.value),
    refreshTokenExpires: encodeURIComponent(refreshTokenExpires),
    accessTokenExpires: encodeURIComponent(accessTokenExpires),
  });
}
