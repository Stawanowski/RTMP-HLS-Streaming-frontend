"use client"
import React, { useEffect, useState } from 'react'
import styles from './Icon.module.css'
import { GiShardSword } from 'react-icons/gi'
import { BsPersonCircle, BsFillHeartFill } from 'react-icons/bs'
import {IoMdSettings} from 'react-icons/io'
import {RiVipDiamondFill} from 'react-icons/ri'
import {AiFillMessage} from 'react-icons/ai'

const Icon = ({iconColor}:{iconColor:string}) => {

  return (
    <div className={styles.container} >
      {iconColor == "#F9ED69" && (
        
        <BsPersonCircle  className={styles.icon} />
      )}
        {iconColor == "#F08A5D" && (
            <IoMdSettings  className={styles.icon} />
        )}
        {iconColor == "#B83B5E" && (
            <BsFillHeartFill  className={styles.icon} />
        )}
        {iconColor == "#7c3c82" && (
            <GiShardSword  className={styles.icon} />
        )}
        {iconColor == "#5b63ab" && (
            <AiFillMessage  className={styles.icon} />
        )}
    </div>
  )
}

export default Icon