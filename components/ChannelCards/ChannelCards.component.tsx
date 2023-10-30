"use client";
import React from "react";
import styles from "./ChannelCards.module.css";
import Image from "next/image";
import Link from "next/link";

export const ChannelCardOffline = ({ channel }: any) => {
  return (
    <Link
      href={`/${channel.username}`}
      className={styles.channelCardOffline}
    >
      <div className={styles.imageContainer}>
        <Image className={styles.pfpImage} src={ channel.pfp ?`${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/${channel.pfp}` : `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/default.webp`}  alt="pfp" fill/>
      </div>
      <div className={styles.contentContainer}>
        <h5>{channel.username}</h5>
        <p>Offline</p>
      </div>
    </Link>
  );
};
export const ChannelCardLive = ({ channel }: any) => {

  return (
    <Link
      href={`/${channel.username}`}
      className={styles.channelCardOnline}
    >
      <div className={styles.imageContainer}>
        <Image className={styles.pfpImage} src={ channel.pfp ?`${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/${channel.pfp}` : `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/default.webp`}  alt="pfp" fill/>
      </div>
      <div className={styles.contentContainer}>
      <h5>{channel.username}</h5>
      <p>Online</p>
      </div>
    </Link>
  );
};
export const CompactChannelCardLive = ({ channel }: any) => {

  return (
    <Link
      href={`/${channel.username}`}
      className={styles.channelCardOnlineCompact}
    >
      <div className={styles.imageContainer}>
        <Image className={styles.pfpImage} src={ channel.pfp ?`${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/${channel.pfp}` : `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/default.webp`} alt="pfp" fill/>
      </div>
    </Link>
  );
};
export const CompactChannelCardOffline = ({ channel }: any) => {

  return (
    <Link
      href={`/${channel.username}`}
      className={styles.channelCardOfflineCompact}
    >
      <div className={styles.imageContainer}>
        <Image className={styles.pfpImage} src={ channel.pfp ?`${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/${channel.pfp}` : `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/default.webp` }  alt="pfp" fill/>
      </div>
    </Link>
  );
};