import { decode } from "@/lib/encryption"
import axios from "axios"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const POST = async(req:Request) => {
    const {username, channel} = await req.json()
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/users/getBannedOnChannel/${username}/${channel}`
    try{
    const response = await ( await axios.get(url) ).data
        return NextResponse.json(response)
    }catch{
        return NextResponse.json(false)
    }
}
