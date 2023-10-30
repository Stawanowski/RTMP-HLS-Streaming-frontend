import { decode } from "@/lib/encryption";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/auth/sendVeryficationEmail`
    const sessionData = cookies().get("session-data");
    const user = decode(sessionData?.value)
    const authToken = user.accessToken
    const axiosConf = {
        headers: {
            authorization: `Bearer ${authToken}`
        }
    }
    try{
        await axios.post(url,{},axiosConf)
        return NextResponse.json("Verified")
    }
    catch(err) {
        console.log(err)
        return NextResponse.json("Error")
    }
}