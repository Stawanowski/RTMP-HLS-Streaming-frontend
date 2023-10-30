import { decode } from "@/lib/encryption";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
        const {description} = await req.json()
        const userData = cookies().get('session-data')?.value

        const decryptedData: any = await decode(userData);
        const url = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/users/changeDescription`
        const axiosConf = {
            headers: {
                authorization: `Bearer ${decryptedData.accessToken}`
        }}
        const res = await axios.post(url, {description: description}, axiosConf)
        if(res.status != 201){
            throw new Error()
        }
        return NextResponse.json('Success')
    }catch{
        return NextResponse.json('Failed')
    }
}