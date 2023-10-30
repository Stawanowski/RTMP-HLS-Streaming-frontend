import { decode } from "@/lib/encryption"
import axios from "axios"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const GET = async(req:Request) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/users/profile`
    const sessionData = cookies().get("session-data");
    const user = decode(sessionData?.value)
    const authToken = user.accessToken
    const axiosConf = {
        headers: {
            authorization: `Bearer ${authToken}`
        }
    }
    try{
        const user = await axios.get(url,axiosConf)
        console.log(user)
        return NextResponse.json(user)
    }catch{
        return NextResponse.json('Failed')
    }
}
