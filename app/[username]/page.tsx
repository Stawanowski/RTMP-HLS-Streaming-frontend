"use client";
import React, { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import styles from "./live.module.css";
import Chat from "@/components/Chat/Chat.component";
import HLSPlayer from "@/components/HLSPlayer/HLSPPlayer.component";
import { verifyLoginData } from "@/lib/verifyAuthentication";
import axios from "axios";
import Image from "next/image";
import Description from "@/components/Description/Description.component";
import io from "socket.io-client";
import { BsFilePerson } from "react-icons/bs";

const socket = io("http://192.168.1.94:3000");

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
  const [userCount, setUserCount] = useState()

  let streaming = false;
  
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
    socket.on("Viewer_update", ({count}: any) => {
      setUserCount(count)
  });

  }, []);

  useEffect((): any => {
    const interval = setInterval(() => {
      checkStreamAvtive();
      revalidateStreamData()
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.col}>
      {isOnline ? (
        <HLSPlayer
          channel={channel}
          native={videoUrlNative}
          hd={videoUrlHD}
          sd={videoUrlSD}
        />
      ) : (
        <div
          style={{
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            letterSpacing: '1px'
          }}
          className={styles.offlineContainer}
        >
          <h1>Offline</h1>
        </div>
      )}
        <div className={styles.row} style={{justifyContent:'space-between',padding:'0.5rem 1rem', alignItems:'center'}}>
          <div className={styles.streamDetails} style={{gap:'0.5rem'}}>
            <div className={styles.imageContainer}>
              <Image className={styles.pfpImage} src={ pfp ? `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/${pfp}` :  `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/default.webp` }  alt="pfp" fill/>
            </div>
            <div className={styles.col}>
              <h3 className={styles.channelTitle}>{channel}</h3>
              <h4 className={styles.streanmTitle}>{streamData.title}</h4>
              <p className={styles.categoryTitle}>{streamData.categoryName}</p>
            </div>
            </div>
          <div className={styles.col} style={{justifyContent:'center'}}>
            {user && user != "Loading" && (<>
            {followed ? (
            <button style={{height:'35px', width:'100px', borderRadius:'10px', border:'none', outline:'none', cursor:'pointer', backgroundColor:'#1a4670'}} onClick={async() => 
                {
                  await axios.post('/api/user/follow', {channel})
                  revalidateUserData()
                }
              }
            >
              Unfollow
            </button>
            ) : (
              <button style={{height:'35px', width:'100px', borderRadius:'10px', border:'none', outline:'none', cursor:'pointer', backgroundColor:'#22668D'}} onClick={async() => 
                {
                  await axios.post('/api/user/follow', {channel})
                  revalidateUserData()
                }
              }
            >
              Follow
            </button>
            )}
            </>
            )}
            <p style={{textAlign:'center', display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', color:'#B83B5E'}}>
              <BsFilePerson size={12} />
               {userCount}</p>
          </div>
        </div>
        <Chat socket={socket} channel={channel} />
        <div style={{position:'relative', padding:'1rem'}}>
        {streamData.description && (
          <Description description={streamData.description} />
        )}
        </div>
      </div>
      
    </div>
  );
};

export default Page;
