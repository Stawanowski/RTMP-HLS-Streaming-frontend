"use client"
import React, { useEffect, useState } from 'react'
import styles from './Navbar.module.css'
import Link from 'next/link'
import { LoginLink, RegisterLink } from '../AuthLinks/AuthLinks.component'
import { verifyLoginData } from "@/lib/verifyAuthentication";
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import type { MotionProps, Variants } from 'framer-motion'
import { IoMdSettings } from 'react-icons/io'
import { Menu, MenuItem, MenuItemSelected } from '../Menu/Menu.component'
import axios from 'axios'

const menu = {
  closed: {
    scale: 0,
    transition: {
      delay: 0.15,
    },
  },
  open: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.4,
      delayChildren: 0.2,
      staggerChildren: 0.05,
    },
  },
} satisfies Variants;

const item = {
  variants: {
    closed: { x: -16, opacity: 0 },
    open: { x: 0, opacity: 1 },
  },
  transition: { opacity: { duration: 0.2 } },
} satisfies MotionProps;


const Navbar = () => {

  const pathname = usePathname()
  const router = useRouter()

  const [user, setUser]: any = useState("Loading" || {} || undefined);
  const [profileMenu, setProfileMenu] = useState(false)
  const [open, setOpen] = useState(false);

  const [pfpComponent, setPfpComponent] = useState(<></>)


  useEffect(() => {

    verifyLoginData(localStorage.getItem('session-data') || undefined)
    .then((res) => {
      // console.log(res)
      if(!res){
        setUser(undefined)
      }else{
        setUser({ username:res?.username, accessTokenExpires:res?.accessTokenExpires, refreshTokenExpires:res?.refreshTokenExpires, email:res?.email, pfp:res?.pfp })
        
      }
    })

  }, [pathname]);

  useEffect(() => {
    console.log(user?.pfp)
    if(user){
    setPfpComponent(
      <div  className={styles.profilePicture__container}>
        <Image onClick={() => setProfileMenu(!profileMenu)} className={styles.pfpPicture} src={ !user.pfp ? `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/default.webp` : `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/${user.pfp}` }  alt="pfp" fill/>
      </div>
    )
    }else{
      return
    }
  }, [user])

  return (
    <div className={styles.container}>
        <div className={styles.Left__container}>
          <Link href={'/'}>
            <h1>Logo</h1>
          </Link>
        </div>
        <div className={styles.Search__container}>
          <Link href={'/'}>
            <h1>Search?</h1>
          </Link>
        </div>
        <div className={styles.Buttons__container}>
          {!user && (
          <>
            <LoginLink />
            <RegisterLink />
          </>
          )}
          {user?.username && 
          (
            <>
             <Menu
                label={pfpComponent}
                open={open}
                setOpen={setOpen}
                animate={open ? "open" : "closed"}
                initial="closed"
                exit="closed"
                variants={menu}
                style={{gap:'0.5rem'}}
              >   
                <Link href='/settings'>
                  <MenuItem {...item} >Profile</MenuItem>
                  </Link>
                  <Link href={ `/${user.username}`}>
                  <MenuItem {...item} >Channel</MenuItem>
                  </Link>
                  <Link href='/settings#settings'>
                  <MenuItem {...item} >Settings</MenuItem>
                  </Link>
                  <MenuItem onClick={async () => {
                      await axios.post('/api/session/removeSessionCookies')
                      localStorage.clear()
                      router.refresh()
                    }
                  } {...item} >Sign out</MenuItem>
              </Menu>
            </>
          )}
          {user == "Loading" && (
            <>
              <h1>Loading</h1>
            </>
          )} 
        </div>
    </div>
  )
}

export default Navbar