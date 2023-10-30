"use client"
// import { changePFP } from '@/lib/changeUserData'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import UploadComponent from '../UploadComponent/UploadComponent.component';

export const ChangePFP = () => {
    // const [file, setFile] = useState<File>()
    const router = useRouter()
    const handleSubmit = async(e:any, file:File) => {
        e.preventDefault()
        if(!file ){
            return
        }
        try{
            const extension = file.name.split('.').pop();
            const type = file.type
            const uuidName = uuidv4(); 
            const newFileName = `${uuidName}.${extension}`;
        
            var blob = file.slice(0, file.size, file.type); 
            var newFile = new File([blob], newFileName, {type: file.type});
            const formData = new FormData()
            formData.append('file', newFile)
            const Bearer = await axios.get('/api/user/getAccessBearer')
            if(!Bearer || Bearer.data == "Failed"){
                return
            }
            const url = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/changePFP`
            const axiosConf = {
                headers: {
                    authorization: `${Bearer.data}`
                }
            }
            await axios.post(url, formData,axiosConf)
            const {newUserData} = await ( await axios.post('/api/user/revalidateData')).data
            localStorage.setItem('session-data', newUserData)
            router.refresh()
        }catch{
            return
        }
    }

  return (
    <UploadComponent handlerFunction={handleSubmit} />
  )
}




export const ChangeUsername = () => {
    const [newUserName, setNewUserName] = useState("")
    const [usernameAvailible, setUsernameAvailible] = useState(true)
    const router = useRouter()
    const handleSubmit = async(e:any) => {
        setUsernameAvailible(true)
        e.preventDefault()
        const availible = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/users/checkUsernameAvalibility`, {username:newUserName})
        if(availible.data == 'availible' && newUserName){
            setUsernameAvailible(true)
            axios.post('/api/user/changeUsername', {newUsername: newUserName})
            const {newUserData} = await ( await axios.post('/api/user/revalidateData')).data
            localStorage.setItem('session-data', newUserData)
            router.refresh()
        }else{
            setUsernameAvailible(false)
            return Response.json('')
        }

    }
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            {!usernameAvailible && (
                <h3>Username unavailible</h3>
            )}
        <label htmlFor="username">Change username picture: </label>
        <input
          type="text"
          name="username"
          id="username"
          required
          accept="image/*"
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button type="submit">Change</button>
    </form>
    )
}

// export default ChangePFP