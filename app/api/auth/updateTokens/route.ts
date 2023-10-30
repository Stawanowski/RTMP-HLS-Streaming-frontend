import { addDaysToDate } from "@/lib/dateExpires";
import { decode, encode } from "@/lib/encryption";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userData } = await req.json();
  const decryptedData: any = await decode(userData);
  try {
    console.log("Trying...")
    if (decryptedData.refreshToken) {
      console.log("Old Data:", decryptedData.accessToken, decryptedData.refreshToken)
      const { accessToken, refreshToken } = await (
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/auth/refreshToken`,
          { refreshToken: decryptedData.refreshToken }
        )
      ).data;

      console.log("New Data:", accessToken, refreshToken)
      const now = new Date();
      const { refreshTokenExpires, accessTokenExpires } = {
        refreshTokenExpires: addDaysToDate(now, 7),
        accessTokenExpires: addDaysToDate(now, 1),
      };
      delete decryptedData.accessToken
      delete decryptedData.accessTokenExpires
      delete decryptedData.refreshToken
      delete decryptedData.refreshTokenExpires
      const newUserData = {
        ...decryptedData,
        refreshToken,
        accessToken,
        refreshTokenExpires,
        accessTokenExpires,
      };
      cookies().set("refreshTokenExpires", refreshTokenExpires.toDateString());

      cookies().set("accessTokenExpires", accessTokenExpires.toDateString());
      cookies().set("session-data", encode(newUserData));
      return NextResponse.json({
        accessTokenExpires: encodeURIComponent(
          accessTokenExpires.toDateString()
        ),
        refreshTokenExpires: encodeURIComponent(
          refreshTokenExpires.toDateString()
        ),
        newUserData: encodeURIComponent(encode(newUserData)),
      });
    } 
  } catch {
    return NextResponse.json("Error");
  }
}
