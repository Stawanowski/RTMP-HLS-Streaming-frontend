import axios from 'axios';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { decode } from './encryption';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}`

export const changePFP = async (file:File) => {
    const extension = file.name.split('.').pop();
    const type = file.type
    const uuidName = uuidv4(); 
    const newFileName = `${uuidName}.${extension}`;
  
    var blob = file.slice(0, file.size, file.type); 
    var newFile = new File([blob], newFileName, {type: file.type});
    try{
        const url = `${API_BASE_URL}/api/v1/users/changePFP`
        const sessionData = cookies().get("session-data");
        const user = decode(sessionData?.value)
        const authToken = user.accessToken
        const axiosConf = {
            headers: {
                authorization: `Bearer ${authToken}`
            }
        }
        const formData = new FormData()
        formData.append('file', newFile)
        await axios.post(url, formData,axiosConf)
        return Response.json('Changed')
    }catch{
        return Response.json('Failed')
    }
}