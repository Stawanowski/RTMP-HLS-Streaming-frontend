"use client";
import styles from "./Chat.module.css";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { commands } from "@/lib/constants";
import { verifyLoginData } from "@/lib/verifyAuthentication";
import axios from "axios";
import {GiShardSword} from 'react-icons/gi'
import { FaCrown } from "react-icons/fa";

// const socket = io("http://192.168.1.94:3000");

const Chat = ({ channel, socket }: { channel: string, socket:any }) => {
  
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog]: any = useState([]);
  const [user, setUser]: any = useState("Loading" || {} || undefined );
  const [streamData, setStreamData]:any = useState("Loading" || {} || undefined)
  const [isMod, setIsMod] = useState(false)
  const [userList, setUserList]:any = useState([])
  const [userCount, setUserCount] = useState(0)
  useEffect((): any => {
    const interval = setInterval(() => {
      revalidateUserData();
      refreshLiveDetails();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { //User Data

    verifyLoginData(localStorage.getItem('session-data') || undefined)
    .then(async(res) => {
      if(!res){
        setUser(undefined)
      }else{
        const isBanned = await ( await axios.post('/api/chat/isBanned', {username: res?.username, channel}) ).data
        if(isBanned){
          setUser("Banned")
        }else{
          setUser({ username:res?.username, accessTokenExpires:res?.accessTokenExpires, refreshTokenExpires:res?.refreshTokenExpires, email:res?.email, follows:res.follows, mod:res.mod })
          let modOn =res.mod
          if( modOn.some((obj:any) => obj.channel === channel)){
            setIsMod(true)
          }else{
            setIsMod(false)
          }
        }
      }
    })
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
  }, [channel]);
  
  useEffect(() => { //Socket
    if( user=="Loading"){
      return
    }
    let username = user?.username
    if(!username){
      username = "Guest"
    }
    socket.emit("join", {channel, user:username});
    console.log("Joined channel:", channel);

    socket.on("connect", () => {
      console.log("Socket connected successfully");
    });
    socket.on("receive_message", (msg: any) => {
      if (msg.channel === channel) {
        console.log("new message", msg.content, msg.content.startsWith(`@${user.username}`))
        if(msg.content.startsWith(`@${user.username}`)) {
          let newContent = {...msg}
          newContent.tagged = true
          console.log("tagged", newContent)
          setChatLog((prevChatLog: Array<any>) => [...prevChatLog, newContent]);
        }else{
        setChatLog((prevChatLog: Array<any>) => [...prevChatLog, msg]);
      }
      }
    });
    
    socket.on("User_list", ({list}:{list:Array<any>}) => {
      setUserList([...list])
    })

    socket.on("Viewer_update", ({count}: any) => {
        setUserCount(count)
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receive_message");
    };
  }, [user]);


  useEffect(() => { //Scroll
    let chat = document.getElementById("chat")
    if(chat){
    chat.scrollTop = chat.scrollHeight  - chat.clientHeight
    }
  }, [chatLog])
  

  const refreshLiveDetails = () => {
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

  const revalidateUserData =() => {
    verifyLoginData(localStorage.getItem('session-data') || undefined)
    .then(async(res) => {
      if(!res){
        setUser(undefined)
      }else{
        setUser({ username:res?.username, accessTokenExpires:res?.accessTokenExpires, refreshTokenExpires:res?.refreshTokenExpires, email:res?.email, follows:res.follows })
        let modOn =res.mod
        if( modOn.some((obj:any) => obj.channel === channel)){
          setIsMod(true)
        }else{
          setIsMod(false)
        }
      }
    })
  }

  console.log('Users: \n', userList)
  const handleSendMessage = async (e:any) => {
    e.preventDefault()
    if (message && message.trim() !== "") {
      if (!user?.username) {
        return;
      }
      if(message.startsWith('/')){
        const testedMessage = message.toLowerCase()
        for(let i =0; i<commands.length; i++)
        {
          if(testedMessage.startsWith(`/${commands[i]}`)){
            if(commands[i] == 'category'){
              const value = message.split(" ")
              let category = ""
              for(let i =1; i<value.length; i++){
                category = `${category}${value[i]} `
              }
              if(category == ""){
                refreshLiveDetails()
                chatLog.push({content: `Current category is: ${streamData.categoryName}`, username:'Command', channel, color:'rgba(71, 154, 201, 0.3)'})
              }else{
                await axios.post('/api/stream/category', {category:category, channel})
                refreshLiveDetails()
              }
            }else if(commands[i] == 'ban'){
              const value = message.split(" ")
              let bannedUser = value[1]
              await axios.post('/api/chat/banUser', {bannedUser, channel})
            }else if(commands[i] == 'unban'){
              const value = message.split(" ")
              let bannedUser = value[1]
              await axios.post('/api/chat/unbanUser', {bannedUser, channel})
            }else if(commands[i] == 'clear' || commands[i] == 'cls'){
              setChatLog([])
            }else if(commands[i] == 'title' || commands[i] == 'cls'){
              const value = message.split(" ")
              let newTitle = ""
              for(let i =1; i<value.length; i++){
                newTitle = `${newTitle}${value[i]} `
              }
              if(newTitle == ""){
                chatLog.push({content: `Current title is: ${streamData.title}`, username:'Command', channel, color:'rgba(71, 154, 201, 0.3)'})
              }else{
                const data = JSON.stringify({ 'title': newTitle, 'channel': channel });
                await axios.post('/api/stream/title',data)
                refreshLiveDetails()
              }
            }else if(commands[i] == 'mod'){
              const value = message.split(" ")
              let newMod = value[1]
              await axios.post('/api/chat/modUser', {newMod, channel})
            }else if(commands[i] == 'unmod'){
              const value = message.split(" ")
              let oldMod = value[1]
              await axios.post('/api/chat/unMod', {oldMod, channel})
            }
            chatLog.push({content: `Command /${commands[i]} executed`, username:'Command', channel, color:'rgba(71, 154, 201, 0.3)'})
            setMessage("")
            return
          }
        }
          chatLog.push({content: `No such command ${testedMessage}`, channel, username: 'Command', color:'rgba(168, 50, 66, 0.3)'})
          setMessage("")
          return
      }
      if(!isMod){
      socket.emit("send_message", {
        content: message,
        channel,
        username: user.username,
      });
      }else if(isMod){
        socket.emit("send_message", {
          content: message,
          channel,
          username: user.username,
          color:"rgba(77, 140, 100, 0.3)"
        });
      }
      setMessage("");
    }
  };
  function splitStringIntoArray(text:string) {
    const words = text.split(' ');
    const lastWord = words.pop(); 
    const beginningText = words.join(' '); 
    return [beginningText, lastWord];
  }
  function handleKeyDown(event:any) {
    if (event.key === 'Tab') {
      event.preventDefault();
      if(!event.target.value || event.target.value == "" || event.target.value?.length == 0) {
        return
      }
    console.log(event.target.value)
      const options:any = userList;
      let [inputValueStart, inputValueEnd] = splitStringIntoArray(event.target.value)
      let nextOption = null;
      if(inputValueEnd?.startsWith('@')) inputValueEnd = inputValueEnd.split('@')[1]
      for (const option of options) {
        const optionValue = option;
        // console.log(optionValue,optionValue.startsWith(`@${inputValueEnd}`))
        if (optionValue.startsWith(inputValueEnd) || optionValue.startsWith(`@${inputValueEnd}`)) {
          nextOption = option.value;
          event.target.value = `${inputValueStart} @${optionValue}`;
          setMessage(`${inputValueStart} @${optionValue}`)
          break;
        }
      }
    }
  }
  return (
    <div className={styles.container}>
      <h4>Chat room: {channel}</h4>
      {user != "Banned" ? (<>
      <div className={styles.chatContainer} id="chat">
        {chatLog.map((msg: any, index: any) => (
          <>
          
          <div
            className={styles.chatMessage}
            key={index}
            style={{backgroundColor: msg.color || 'rgba(0, 0, 0, 0.24)', borderBottom: msg.tagged ? "1px solid rgba(140, 18, 255)" : "none", borderRight: msg.tagged ? "1px solid rgba(140, 18, 255)" : "none"}}
          >
            {msg?.color == "rgba(77, 140, 100, 0.3)" && (
              <span style={{display:'flex', alignItems:'center', backgroundColor:'#48b553', color:'white', padding:'2px', borderRadius:'5px', marginRight:'5px', height:"17px", width:"17px"}}>
                <GiShardSword  />
              </span>
            )}
            {msg?.color == "#fdf9ce2f" && (
              <span style={{display:'flex', alignItems:'center', backgroundColor:'#736b19', color:'white', padding:'2px', borderRadius:'5px', marginRight:'5px', height:"17px", width:"17px"}}>
                <FaCrown  />
              </span> 
            )}
            {`${msg.username}:  ${msg.content}`}</div>
          </>
        ))}
      </div>
      <div className={styles.chatInput}>
        {user && user != "Loading" && (
          <form style={{height:'100%'}} onSubmit={handleSendMessage}>
            <input
            type="text"
            style={{ height: '100%' }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Type a message ${user.username}`}
            // list={userList}
            onKeyDown={handleKeyDown}
          />
            <button type="submit" style={{height:'100%'}}>Send</button>
          </form>
        )}
        {user == "Loading" && (
          <>
            <input
              type="text"
              value="Loading"
              readOnly
              style={{width:'100%'}}
              placeholder="Loading"
            />
          </>
        )}
        {!user && (
          <>
            <input
              type="text"
              readOnly
              value="You must be logged in"
              placeholder="You must be logged in"
              style={{width:'100%'}}
            />
          </>
        )}
      </div>
      </>) : (
        <>
          <h1>You are banned on this channel</h1>
        </>
      )}
    </div>
  );
};

export default Chat;


   