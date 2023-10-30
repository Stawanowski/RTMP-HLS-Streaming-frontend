"use client";
import React, { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import styles from "./live.module.css";
import Chat from "@/components/Chat/Chat.component";
import HLSPlayer from "@/components/HLSPlayer/HLSPPlayer.component";
import { verifyLoginData } from "@/lib/verifyAuthentication";
import axios from "axios";
import Image from "next/image";
import { redirect } from "next/navigation";
const Page = ({ params }: { params: any }) => {
  const channel = params.username;
  const videoUrlNative = `http://192.168.1.94:3000/api/v1/stream/hlsout/${channel}/playlist.m3u8`;
  const videoUrlHD = `http://192.168.1.94:3000/api/v1/stream/hlsout/${channel}/720/playlist.m3u8`;
  const videoUrlSD = `http://192.168.1.94:3000/api/v1/stream/hlsout/${channel}/480/playlist.m3u8`;

  const [streamData, setStreamData]:any = useState("Loading" || {} || undefined)
  const [isOnline, setIsOnline] = useState(false);
  const [user, setUser]:any = useState("Loading" || {} || undefined)
  const [followed, setFollowed] = useState(false)  
  const [pfp, setPfp] = useState("" || undefined)
  let streaming = false;
  useEffect(() => {
    console.error(`Route deprecated, redirecting to correct route...`)
    redirect(`/${channel}`)
  })
  const revalidateStreamData =() =>{
    try{
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/stream/getLiveDetails/${encodeURIComponent(channel)}`)
      .then(async(res) => {
        if(res.status != 200){
          setStreamData(undefined)
          return
        }
        setStreamData(res.data)
      }).catch((err) => {
        setStreamData(undefined)
      })
    }catch{
      setStreamData(undefined)
    }
  }

  const checkStreamAvtive = () => {
    fetch(videoUrlNative)
      .then((res) => {
        if (res.status == 500) {
          streaming = false;
          setIsOnline(false);
        } else if (res.status == 404) {
          streaming = false;
          setIsOnline(false);
        }else if (!streaming && Hls.isSupported()) {
          streaming = true;
          setIsOnline(true);
        }
      })
      .catch((e) => {
        streaming = false;
        setIsOnline(false);
      });
  };

  const revalidateUserData =() => {
    verifyLoginData(localStorage.getItem('session-data') || undefined)
    .then(async(res) => {
      if(!res){
        setUser(undefined)
      }else{
        setUser({ username:res?.username, accessTokenExpires:res?.accessTokenExpires, refreshTokenExpires:res?.refreshTokenExpires, email:res?.email, follows:res.follows })
        let follows =res.follows
        if( follows.some((obj:any) => obj.channel === channel)){
          setFollowed(true)
        }else{
          setFollowed(false)
        }
      }
    })
  }

  useEffect((): any => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/users/getPfp?username=${channel}`)
    .then((res) => {
      setPfp(res.data)
    }).catch((err) => {
      console.error("Failed fetching profile picture")
    })
    revalidateUserData();
    revalidateStreamData();
    checkStreamAvtive();
  }, []);

  useEffect((): any => {
    const interval = setInterval(() => {
      checkStreamAvtive();
      revalidateStreamData()
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <></>
  );
};

export default Page;
