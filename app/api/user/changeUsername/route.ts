import { decode } from "@/lib/encryption";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
        const {newUsername} = await req.json()
        const userData = cookies().get('session-data')?.value

        const decryptedData: any = await decode(userData);
        const url = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/users/updateUsername`
        const axiosConf = {
            headers: {
                authorization: `Bearer ${decryptedData.accessToken}`
        }}
        await axios.post(url, {username: newUsername}, axiosConf)
        return NextResponse.json('Success')
    }catch{
        return NextResponse.json('Failed')
    }
}