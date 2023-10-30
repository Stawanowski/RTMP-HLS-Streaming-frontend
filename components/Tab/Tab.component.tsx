"use client"
import React, { useRef,useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import cn from "classnames"; // Optional but helpful library
import Icon from "../Icon/Icon.component";
import { usePathname } from 'next/navigation'
import styles from './Tab.module.css'
import { AnimatePresence, animate, motion } from "framer-motion";
import Image from "next/image";
import {ChangePFP, ChangeUsername} from "../ChangeUserData/ChangeUserData.component";
import axios from "axios";
import Description from "../Description/Description.component";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import UploadComponent from "../UploadComponent/UploadComponent.component";



export const TabComponent = ({ tabs, defaultIndex = 0, userData }:{tabs:any, defaultIndex:number, userData:User}) => {
  const editorRef:any = useRef(null);
  // const initialItemsToShow = 5
  const [amountItemsToShow, setAmountItemsToShow] = useState(5)
  const router = useRouter()
  let   [user, setUser] = useState(userData)
  const [files, setFiles] = useState([...user.Files].reverse())
  const [activeTabIndex, setActiveTabIndex] = useState(defaultIndex);
  const createdAt = new Date(user.createdAt)
  const [itemsToShow, setItemsToShow] = useState(user.messagesSent.slice(0, amountItemsToShow));
  const [descriptionChangeStatus, setDescriptionChangeStatus] = useState(0)
  const streamKey = `${user.username}?key=${user.streamKey}`
  const streamingAdress = process.env.NEXT_PUBLIC_STREAMING_ADRESS || ""
  const [vCode, setVCode] = useState("")
  const [emailSentStatus, setEmailSentStatus] = useState(false)
  const onTabClick = (index:any) => {
    setActiveTabIndex(index);
    // router.replace(`#${tabs[index].title}`)
    history.pushState({}, "",`#${tabs[index].title}`)

  };
  useEffect(()=>{
    try{
        const path = window.location.hash.substring(1);
        if(path){
            switch (path){
                case "profile":
                    setActiveTabIndex(0)
                    return
                case "settings":
                    setActiveTabIndex(1)
                    return
                case "follows":
                    setActiveTabIndex(2)
                    return
                case "mods":
                    setActiveTabIndex(3)
                    return
                case "Message":
                    setActiveTabIndex(4)
                    return
                default:
                    setActiveTabIndex(0)
                    return
            }
        }
    }catch{
        return
    }
  }, [])

  console.log(itemsToShow)
  
  const tabVariant = {
    active: {
      width: "200px",
      transition: {
        type: "linear",
        duration: 0.4
      }
    },
    inactive: {
      width: '60px',
      transition: {
        type: "linear",
        duration: 0.4
      }
    }
  }; 

  const tabTextVariant = {
    active: {
      opacity: 1,
      display: "block",
      transition: {
        type: "tween",
        duration: 0.3,
        delay: 0.3
      }
    },
    inactive: {
      opacity: 0,
      transition: {
        type: "tween",
        duration: 0.3,
        delay: 0.1
      },
      transitionEnd: { display: "none" }
    }
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--active-color",
      tabs[activeTabIndex].color
    );
  }, [activeTabIndex, tabs]);

  
  const handleChangeDescritpion =async () => {
    if (editorRef.current) {
      let description = editorRef.current.getContent()
      try{
        setDescriptionChangeStatus(1)
        await axios.post('/api/user/changeDescription', {description})
        setDescriptionChangeStatus(0)
      }catch{
        setDescriptionChangeStatus(2)
      } 
    }
  }


  const handleBannerUpload = async(e:any, file:File) => {
    e.preventDefault()
    if(!file ){
        return
    }
    try{
        const extension = file.name.split('.').pop();
        const type = file.type
        const uuidName = `${user.username}-Banner-${uuidv4()}` 
        const newFileName = `${uuidName}.${extension}`;
    
        var blob = file.slice(0, file.size, file.type); 
        var newFile = new File([blob], newFileName, {type: file.type});
        const formData = new FormData()
        formData.append('file', newFile)
        const Bearer = await axios.get('/api/user/getAccessBearer')
        if(!Bearer || Bearer.data == "Failed"){
            return
        }
        const url = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/uploadAndLog`
        const axiosConf = {
            headers: {
                authorization: `${Bearer.data}`
            }
        }
        await axios.post(url, formData,axiosConf)
        setFiles([{title:newFileName,onChannel:user.username }, ...files])
    }catch{
        return
    }
}
  const handleEmailVerification = async(e:any) => {
    e.preventDefault()
    if(!vCode) return;
    try{
      const res = await axios.post('/api/auth/verifyEmail', {code:vCode})
      console.log('response: \n', res.data)
      if(res.data == "Error") throw new Error();
      let newData = {...user}
      newData.emailVerified = true
      setUser(newData)
      // router.refresh()
    }catch(err:any){
      console.error(err.response.status)
      return
    }
  }
  return (
    <div className={styles.tabsComponent}>
      {!user.emailVerified && (
        <div className={styles.emailWarn}>
          <h3>Your email is not verified.</h3>
        </div>
      )}
      <ul className={styles.tabLinks} role="tablist">
        {tabs.map((tab:any, index:number) => (
          <motion.li
            key={tab.id}
            className={index === activeTabIndex ? styles.activeTab : styles.tab}
            role="presentation"
            variants={tabVariant}
            animate={activeTabIndex === index ? "active" : "inactive"}
          >
            <a  onClick={() => onTabClick(index)} >
              <Icon iconColor={tab.color} />
              <motion.span variants={tabTextVariant}>{tab.title}</motion.span>
            </a>
          </motion.li>
        ))}
      </ul>
      <div className={styles.tabContent}>
        {tabs.map((tab: any, index: number) => (
          <AnimatePresence key={tab.id}>
            {activeTabIndex === index && (
              <motion.div
                className={styles.activeContentContainer}
                id={tab.id}
                initial={{
                    opacity: 0,
                    scaleX: 0
                  }}
                animate={{ opacity: 1, scaleX:1, transition: { delay: 0.26, duration:0.55 }}}
                exit={{
                    opacity: 0,
                    scaleX: 0,
                    transition: { delay: 0, duration:0.25 }
                  }}
                transition={{ ease: 'easeOut', duration: 0.8, delay:0.25 }}
              >
                {tab.title == "Profile" && (
                    <>
                    <div className={styles.col} style={{gap:'1rem', justifyContent:'center', maxHeight:'100%'}} >
                        <h2 style={{color:tab.color, textAlign:'center'}}>{user.username}</h2>
                        <div className={styles.row} >
                            <div className={styles.col}>
                                <div className={styles.imageContainer}>
                                    <Image className={styles.pfpImage} src={ user.pfp ? `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/${user.pfp}` :  `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/default.webp` }  alt="pfp" fill/>
                                </div>
                            </div>
                            <div className={styles.col}>

                                <label>Email: {user.email}</label>
                                <label>Member since: {createdAt.getDate()}.{createdAt.getUTCMonth()+1}.{createdAt.getFullYear()}</label>
                                <label >Followers: {user.followedBy.length}</label>
                            </div>
                        </div>
                        <h4>Description: </h4>
                      <Description description={user.description} />
                    </div>
                    </>
                )}
                 {tab.title == "Settings" && (
                    <div className={styles.col} style={{gap:'1rem'}}>
                        <label>Stream server: <h5 onClick={(e:any) => navigator.clipboard.writeText(streamingAdress)}  className={styles.dataString}>{streamingAdress}</h5></label>
                        <label>Stream key: <h5 onClick={(e:any) => navigator.clipboard.writeText(user.emailVerified ? streamKey : "You need to verify your account in order to stream")} className={styles.dataString}>{user.emailVerified ? streamKey : "You need to verify your account in order to stream"}</h5></label>
                        <ChangePFP />
                        <ChangeUsername />
                        {!user.emailVerified && (
                          <div className={styles.row}>
                            <form onSubmit={handleEmailVerification}>
                              <input type="text" onChange={(e) => setVCode(e.target.value)} />
                              <input type="submit" />
                            </form>
                            <button onClick={async() => {
                              if(!emailSentStatus){
                                try{
                                const res = await axios.post('/api/auth/sendVerificationEmail')
                                if(res.data == "Verified")setEmailSentStatus(true)
                                }catch{
                                  return
                                }
                              }
                            }}>
                              {emailSentStatus ? (
                              <>
                                Verification Email sent
                              </>
                              ) : (
                                <>
                                Send verification email
                                </>
                              )}
                            </button>
                          </div>
                        )}
                        <div className={styles.DescriptionEditorContainer}>
                        {descriptionChangeStatus == 1 && (
                          <h4>Changing...</h4>
                        )}
                        {descriptionChangeStatus == 2 && (
                          <h4>Change failed</h4>
                        )}
                        <UploadComponent handlerFunction={handleBannerUpload}  />
                          <br />
                          Editor components:
                          <ul>
                            
                            <li>Ad banner: <b> [Banner src="uploadedFile" link="Banner link" /] </b>- Recommended aspect ratio: 32/9</li>
                            <li>Soclials link: <b> [Social type="One of: twitter || x || youtube || instagram || facebook || discord" link="link" /] </b></li>
                            <li>To enter fullscreen editor use: ctrl/command + shift + f while the editor is selected</li>
                            
                          </ul>
                          <br />
                          
                        <div
                          className={styles.row}
                        >
                          <div style={{width:'100%'}}>
                            <Editor
                                apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
                                onInit={(evt, editor) => editorRef.current = editor}
                                initialValue={user.description}
                                init={{
                                  height: 500,
                                  menubar: 'insert table ',
                                  plugins: 'autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount table link fullscreen directionality advcode visualchars mediaembed codesample pagebreak nonbreaking editimage',                                  default_link_target: '_blank',
                                  toolbar: 'undo redo formatselect bold italic backcolor alignleft aligncenter alignright alignjustify bullist numlist outdent indent linktable tabledelete tableprops tablerowprops tablecellprops tableinsertrowbefore tableinsertrowafter tabledeleterow tableinsertcolbefore tableinsertcolafter tabledeletecolremoveformat helpnumlist bullistfullscreen print spellcheckdialog formatpainter blocks fontfamily fontsize underline forecolor link image lineheight checklist removeformat',
                                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                  skin: 'oxide-dark',
                                  content_css: 'dark',
                                  fullscreen_native: true
                                }}
                            />
                          </div>
                          <div style={{width:'max-content', backgroundColor:'rgba(0,0,0,0.1)', padding:'0.5rem', position:'relative', height:'500px'}} className={styles.col}>
                            {files && (
                            <>
                              <h5>Your uploaded files ( src )</h5> 
                              <ul style={{display:'flex', flexDirection:'column', gap:'.5rem', overflowY:'scroll', height:'100%'}}>
                                {files.map(({title}:{title:string}) => (
                                  <li key={title} onClick={(e:any) => navigator.clipboard.writeText(title) } id={title} className={styles.dataString}  >{title}</li>
                                  ))}
                              </ul>
                            </>
                            )}
                
                          </div> 
                        </div>
                        <button onClick={handleChangeDescritpion}>Log editor content</button>
                      </div>
                    </div>
                )}
                {tab.title == "Follows" && (
                    <div  className={styles.row}>
                        <div className={styles.col} style={{gap:'1rem'}}>
                            <h4 style={{color:tab.color}}>Following you</h4>
                            {user.followedBy.map((follow:Follow,index:number) => (
                                <div key={`${follow.id}-${Math.random() *8}` } className={styles.col}>
                                    <p>
                                        Username: {follow.username}
                                    </p>
                                    <p>
                                        Since: {new Date(follow.followingSince).getDate()}.{new Date(follow.followingSince).getMonth() +1}.{new Date(follow.followingSince).getFullYear()}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.col} style={{gap:'1rem'}}>
                            <h4 style={{color:tab.color}}>Your follows</h4>
                            {user.follows.map((follow:Follow,index:number) => (
                                <div key={`${follow.id}-${Math.random() *8}` } className={styles.col}>
                                    <p>
                                        Username: {follow.username}
                                    </p>
                                    <p>
                                        Since: {new Date(follow.followingSince).getDate()}.{new Date(follow.followingSince).getMonth() +1}.{new Date(follow.followingSince).getFullYear()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {tab.title == "Mods" && (
                    <div className={styles.row}>
                        <div className={styles.col} style={{gap:'1rem', justifyContent:'center', textAlign:'center'}}>
                            <h4 style={{color:tab.color}}>Mods on your channel</h4>
                            {user.moddedHere.map((mod:Mod,index:number) => (
                                <div key={`${mod.id}-${Math.random() *8}` } className={styles.col}>
                                    <p>
                                        Username: {mod.username}
                                    </p>
                                    <p>
                                        Since: {new Date(mod.modSince).getDate()}.{new Date(mod.modSince).getMonth() +1}.{new Date(mod.modSince).getFullYear()}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.col} style={{gap:'1rem', justifyContent:'center', textAlign:'center'}}>
                            <h4 style={{color:tab.color}}>You are a Mod on channels</h4>
                            {user.modOn.map((mod:Mod,index:number) => (
                                <div key={`${mod.id}-${Math.random() *8}` }  className={styles.col}>
                                    <p>
                                        Username: {mod.username}
                                    </p>
                                    <p>
                                        Since: {new Date(mod.modSince).getDate()}.{new Date(mod.modSince).getMonth() +1}.{new Date(mod.modSince).getFullYear()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {tab.title == "Message" && (
                  <>
                    <div className={styles.col} style={{gap:'1rem', justifyContent:'center', textAlign:'center'}}>
                      
                      {user && user.messagesSent && (
                        <>
                          <div   className={styles.row} style={{marginBottom:'2rem', flexDirection: 'row', justifyContent:'space-evenly', textAlign:'left'}}>
                              <p>Day.Month.Year</p>
                              <h4>Channel</h4>
                              <p>Message</p>
                          </div>
                        {/* <h1>asd</h1> */}
                        {itemsToShow.map((i)=>(
                          <>

                            <div style={{flexDirection: 'row',  justifyContent:'space-evenly', textAlign:'left'}} className={styles.row}>
                              <p style={{flex:'1'}}>
                                {
                                  `${(new Date(i.sentOn)).getDate()}.${(new Date(i.sentOn)).getMonth() +1}.${(new Date(i.sentOn)).getFullYear()}`  
                                }
                              </p>
                              <h4 style={{flex:'1'}}>channel: {i.channel}</h4>
                              <p style={{flex:'1'}}>{i.content}</p>
                            </div>
                          </>
                        ))}
                        {user.messagesSent.length > amountItemsToShow && (
                        <button onClick={() => {
                          if(amountItemsToShow +5 > user.messagesSent.length ){
                            setAmountItemsToShow(user.messagesSent.length)
                          }else{
                            setAmountItemsToShow(amountItemsToShow+5)
                          }
                          setItemsToShow(user.messagesSent.slice(0, amountItemsToShow))
                        }}>Load More</button>
                        )}
                      </>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div> 
    </div>
  );
};

export default TabComponent;
