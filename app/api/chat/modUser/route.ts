import { decode } from "@/lib/encryption"
import axios from "axios"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const POST = async(req:Request) => {
    const {newMod, channel} = await req.json()
    console.log(channel)
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/users/addMod`
    const sessionData = cookies().get("session-data");
    const user = decode(sessionData?.value)
    const authToken = user.accessToken
    const axiosConf = {
        headers: {
            authorization: `Bearer ${authToken}`
        }
    }
    try{
    await axios.post(url, {channel:channel, username: newMod},axiosConf)
        return NextResponse.json('P')
    }catch{
        return NextResponse.json('Failed')
    }
}
