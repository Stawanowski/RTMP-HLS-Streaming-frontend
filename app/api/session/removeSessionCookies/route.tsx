import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const POST = async(req:Request) =>{
    try{
        cookies().delete('session-data')
        cookies().delete('refreshTokenExpires')
        cookies().delete('accessTokenExpires')
        return NextResponse.json("Removed")
    }catch{
        return NextResponse.json("Failed")
    }
}