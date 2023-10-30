import React, { use } from 'react'
import styles from './settings.module.css'
import { cookies } from 'next/headers'
import { decode } from '@/lib/encryption'
import axios from 'axios'
import { redirect } from 'next/navigation'
import Profile from '@/components/Settings/Profile/Profile.component'
import Settings from '@/components/Settings/Settings/Settings.component'
import { TabComponent } from '@/components/Tab/Tab.component'
import {tabs} from '@/lib/constants'
import { verifyLoginData } from '@/lib/verifyAuthentication'

const page = async () => {
    const fetchUser = async() => {
        try{
            const url = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/users/profile`
            const sessionData = cookies().get("session-data");
            const userData = decode(sessionData?.value)
            const authToken = userData.accessToken
            const axiosConf = {
                headers: {
                    authorization: `Bearer ${authToken}`
            }}
            const user = await ( await axios.get(url,axiosConf) ).data
            if(!user){
                throw new Error("No user")
            }
            return user
        }catch(err:any){
            console.log(err)
            redirect('/auth/login')
        }
    }

    let user:User  = await fetchUser()
    const revalidateUserData =async () => {
        const temp =  await fetchUser()
        if(!temp){
            redirect('/auth/login')
        } 
        return temp
    }
   
  return (
    <div className={styles.container}>
        <TabComponent tabs={tabs} defaultIndex={0} userData={user} />
    </div>
  )
}

export default page