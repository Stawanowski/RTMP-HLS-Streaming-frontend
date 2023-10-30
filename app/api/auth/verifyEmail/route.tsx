import { decode } from "@/lib/encryption";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const {code} = await req.json()
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/auth/verifyEmail`
    const sessionData = cookies().get("session-data");
    const user = decode(sessionData?.value)
    const authToken = user.accessToken
    const axiosConf = {
        headers: {
            authorization: `Bearer ${authToken}`
        }
    }
    try{
        const res = await axios.post(url,{code},axiosConf)
        if(res.status != 200) throw new Error()
        return NextResponse.json({
            message: "Verified"
          }, {
            status: 200,
          })
    }
    catch(err) {
        return NextResponse.json({
            message: "Error"
          }, {
            status: 500,
          })
    }
}