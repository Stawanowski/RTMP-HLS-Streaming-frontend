import { decode } from "@/lib/encryption"
import axios from "axios"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const POST = async(req:Request) => {
    console.log(11)
    const {category, channel} = await req.json()
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/stream/changeCategory`
    const sessionData = cookies().get("session-data");
    console.log(sessionData)
    const user = decode(sessionData?.value)
    console.log(user, category.charAt(0).toUpperCase() + category.slice(1))
    const authToken = user.accessToken
    const axiosConf = {
        headers: {
            authorization: `Bearer ${authToken}`
        }
    }
    try{
    await axios.post(url, {channel, category},axiosConf)
    return NextResponse.json('P')
    }catch{
        return NextResponse.json('Failed')
    }
}
