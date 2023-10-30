import { decode, encode } from "@/lib/encryption";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
  const userData = cookies().get('session-data')?.value

  const decryptedData: any = await decode(userData);
  const url = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/users/profile`
  const axiosConf = {
    headers: {
        authorization: `Bearer ${decryptedData.accessToken}`
  }}
  const revalidateUserData = await ( await axios.get(url,axiosConf) ).data
  const newData = {
    username: revalidateUserData.username,
    email: revalidateUserData.email,
    refreshToken: decryptedData.refreshToken,
    accessToken: decryptedData.accessToken,
    refreshTokenExpires: decryptedData.refreshTokenExpires,
    accessTokenExpires: decryptedData.accessTokenExpires,
    pfp: revalidateUserData.pfp
  }
  // console.log(newData.files, 222 , revalidateUserData.Files)
  cookies().set("session-data", encode(newData));
  return NextResponse.json({
    newUserData: encodeURIComponent(encode(newData)),
  });
    }catch{
        return NextResponse.json("Failed");
    }
}