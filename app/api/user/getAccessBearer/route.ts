import { decode } from "@/lib/encryption"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const GET = async (req:Request) => {
    try{
        const session = await cookies().get('session-data')?.value
        if(!session || session == "undefined"){
            return NextResponse.json('Failed')
        }
        const decodedSession = decode(session)
        const Bearer = `Bearer ${decodedSession.accessToken}`
        return NextResponse.json(Bearer)
    }catch{
        return NextResponse.json('Failed') 
    }
}