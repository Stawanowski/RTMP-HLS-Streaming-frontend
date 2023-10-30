"use client"
import React, { useEffect } from 'react'
import axios from 'axios'
import { decode, encode } from '@/lib/encryption'

const Loader = () => {


  const revalidateAuth = () => {
    let data = localStorage.getItem("session-data")
    let refreshTokenExpires:any = localStorage.getItem("refreshTokenExpires")
    let accessTokenExpires:any = localStorage.getItem("accessTokenExpires")
    axios.get('/api/readCookies/session')
    .then(async(res) => {
      // if(res.data.userData == 'undefined' || !res.data.userData){
        
        if(!data && res.data.userData && res.data.refreshTokenExpires && res.data.accessTokenExpires){
          data = res.data.userData
          refreshTokenExpires = res.data.refreshTokenExpires 
          accessTokenExpires = res.data.accessTokenExpires
          localStorage.setItem('session-data', res.data.userData)
          localStorage.setItem('refreshTokenExpires', res.data.refreshTokenExpires)
          localStorage.setItem('accessTokenExpires', res.data.accessTokenExpires)
          console.info("!!Loader -- Reading data from cookies ")
        }
        if(data && data != 'undefined'){
          if((!accessTokenExpires || !refreshTokenExpires) && data && data != "undefined"){
            const temp = await axios.post('/api/session/readSessionData', {sessionData:data})
            accessTokenExpires = temp.data.accessTokenExpires
            refreshTokenExpires  = temp.data.refreshTokenExpires
            localStorage.setItem("accessTokenExpires", accessTokenExpires)
            localStorage.setItem("refreshTokenExpires",refreshTokenExpires)
          console.info("!!Loader -- Reading Expiration dates from cookies ")

          }

          // if(accessTokenExpires && refreshTokenExpires){
            const dateOfExpirationRefresh = new Date(decodeURIComponent(refreshTokenExpires))
            const dateOfExpirationAccess = new Date(decodeURIComponent(accessTokenExpires))
            const currentDate = new Date()
            const modified = await ( (await axios.post('/api/session/verifyExpirationDates', {accessTokenExpires, refreshTokenExpires, sessionData: data})).data)
            console.log('modified:', modified)
            if(modified)
            {
              localStorage.clear()
              return
            } else{
              if(dateOfExpirationRefresh > currentDate && dateOfExpirationAccess < currentDate && data){
                console.log("Updating tokens:... \n", data, " \n RefreshExpires: ", dateOfExpirationRefresh, " \n AccessExpires: ", dateOfExpirationAccess)
                const {newUserData, accessTokenExpires, refreshTokenExpires} = await ( await axios.post('/api/auth/updateTokens', {userData:data})).data
                // console.log(newUserData)
                console.info("!!Loader -- Update Tokens...")

                localStorage.setItem('session-data', newUserData)
                localStorage.setItem('refreshTokenExpires', refreshTokenExpires)
                localStorage.setItem('accessTokenExpires', accessTokenExpires)
              }else if(dateOfExpirationRefresh < currentDate){
                // console.log("Tokens expired")
                console.info("!!Loader -- Tokens expires ")
                localStorage.removeItem('session-data')
                localStorage.removeItem('refreshTokenExpires')
                localStorage.removeItem('accessTokenExpires')
              }else if(dateOfExpirationRefresh > currentDate && dateOfExpirationAccess >= currentDate && data){
                // console.log("Tokens valid")
                console.info("!!Loader -- Tokens valid... Revriting cookies")
                await axios.post('/api/session/setSessionCookie', {data, refreshTokenExpires:dateOfExpirationRefresh, accessTokenExpires:dateOfExpirationAccess})
              }
            }
          // }
        }else{
        if((res.data.userData && res.data.refreshTokenExpires && res.data.accessTokenExpires ) && (!localStorage.getItem('session-data') || !localStorage.getItem('refreshTokenExpires') || !localStorage.getItem('accessTokenExpires'))){
            console.info("!!Loader -- Restoring data from cookies ")
            localStorage.setItem('session-data', res.data.userData)
            localStorage.setItem('refreshTokenExpires', res.data.refreshTokenExpires)
            localStorage.setItem('accessTokenExpires', res.data.accessTokenExpires)
          }
        }
        console.info("!!Loader -- No data???")
    }
    )
  }



  useEffect(() => {
    revalidateAuth()
  }, [])
  return (
    <div style={{width: '0px', height:'0px'}}></div>
  )
}

export default Loader