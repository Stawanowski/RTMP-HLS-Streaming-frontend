import Link from 'next/link'
import React from 'react'
import {BsDiscord, BsFacebook, BsInstagram, BsTwitter, BsYoutube} from "react-icons/bs"

const Social = ({type, link}:any) => {
  return (
    <Link style={{width:"30px", height:"30px", display:'inline-block'}} href={`https://${link}`} >
            {type == "facebook" && <BsFacebook size={30} style={{color:'#316FF6'}} />} 
            {type == "instagram" && <div style={{background: 'linear-gradient(115deg, #f9ce34, #ee2a7b, #6228d7)', backgroundSize: '200% 200%', width:'30px', height:'30px',borderRadius:'15px', color:'#242323'}}><BsInstagram size={30}  /></div>} 
            {type == "x" && <BsTwitter size={30} style={{color:'#1DA1F2'}} />} 
            {type == "discord" && <BsDiscord size={30} style={{color:'#5865F2'}} />} 
            {type == "twitter" && <BsTwitter size={30} style={{color:'#1DA1F2'}} />} 
            {type == "youtube" && <BsYoutube size={30} style={{color:'#FF0000'}} />}
    </Link>
  )
}

export default Social