import { decode } from "@/lib/encryption"
import { NextResponse } from "next/server"

export async function POST(req:Request) {
    const {refreshTokenExpires, accessTokenExpires, sessionData} = await req.json()
    // if(!refreshTokenExpires || refreshTokenExpires == "undefined" || !sessionData || sessionData == "undefined" || !accessTokenExpires || accessTokenExpires =='undefined'){
    //     return NextResponse.json
    // }
    const deocdedSession = decode(sessionData)
    const refreshSessionDate = new Date(deocdedSession.refreshTokenExpires)
    const accessSessionDate = new Date(deocdedSession.accessTokenExpires)
    const accessSessionDay = accessSessionDate.getDate(); 
    const accessSessionmonth = accessSessionDate.getMonth(); 
    const accessSessionyear = accessSessionDate.getFullYear();
    const refreshSessionDay = refreshSessionDate.getDate(); 
    const refreshSessionmonth = refreshSessionDate.getMonth(); 
    const refreshSessionyear = refreshSessionDate.getFullYear();
    const refreshDate = new Date(decodeURIComponent(refreshTokenExpires))
    const accessDate = new Date(decodeURIComponent(accessTokenExpires))
    const refreshDay = refreshDate.getDate(); 
    const refreshMonth = refreshDate.getMonth(); 
    const refreshYear = refreshDate.getFullYear();
    const accessDay = accessDate.getDate(); 
    const accessMonth = accessDate.getMonth(); 
    const accessYear = accessDate.getFullYear();
    // console.log(!deocdedSession?.refreshTokenExpires ,!deocdedSession ,!deocdedSession?.accessTokenExpires)
    // console.log(refreshYear, refreshDay, refreshMonth, refreshSessionyear, refreshSessionDay, refreshSessionmonth, accessYear, accessDay, accessMonth, accessSessionyear, accessSessionDay, accessSessionmonth )
    if(deocdedSession?.refreshTokenExpires || deocdedSession || deocdedSession?.accessTokenExpires)
    {
        if(refreshDay != refreshSessionDay || refreshMonth != refreshSessionmonth || refreshYear != refreshSessionyear || accessDay != accessSessionDay || accessMonth != accessSessionmonth || accessYear != accessSessionyear)
        {
            return NextResponse.json(true)
        }else{
            return NextResponse.json(false)
        }
    }else{
        return NextResponse.json(true)
    }
}