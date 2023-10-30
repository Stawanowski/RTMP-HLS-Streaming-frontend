"use client";
import styles from "./HLSPlayer.module.css";
import React, { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import Controls from "./Controls/Controls";
import {FaPlay, FaPause, FaVolumeDown} from 'react-icons/fa'
import {IoMdSettings} from 'react-icons/io'
import {BsPip} from 'react-icons/bs'
import {BiFullscreen, BiExitFullscreen} from 'react-icons/bi'
import type { MotionProps, Variants } from "framer-motion";
import { Menu, MenuItem, MenuItemSelected } from "../Menu/Menu.component";

let hls: any;
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

const HLSPlayer = ({
  native,
  hd,
  sd,
  channel,
}: {
  native: string;
  hd: string;
  sd: string;
  channel: string;
}) => {
  const videoRef: any = useRef(null);

  const [videoUrl, setVideoUrl] = useState(native);
  const [initVolume, setInitVolume]: any = useState(0);
  const [isResMenuOpen, setIsResMenuOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume]: any = useState(parseFloat(initVolume) || 0.5);
  const [pipMode, setPipMode] = useState(false);
  const [fullScreenControls, setFullScreenControls] = useState(styles.controls)
  const [open, setOpen] = useState(false);



  useEffect((): any => {
    hls = new Hls();
    hls.loadSource(native);
    hls.attachMedia(videoRef.current);
    setInitVolume(localStorage.getItem("volume"));
  }, []);

  const handleChangeRes = (res: any) => {
    if (res == 1080) {
      setVideoUrl(native);
      hls.detachMedia();
      hls.loadSource(native);
      hls.attachMedia(videoRef.current);
    } else if (res == 720) {
      setVideoUrl(hd);
      hls.detachMedia();
      hls.loadSource(hd);
      hls.attachMedia(videoRef.current);
    } else if (res == 480) {
      setVideoUrl(sd);
      hls.detachMedia();
      hls.loadSource(sd);
      hls.attachMedia(videoRef.current);
    } else {
      return;
    }
  };

  const handleFullScreen = () => {
    const playerContainer = document.getElementById("playerContainer");
    if (playerContainer) {
      if (document.fullscreenElement) {
        setFullscreen(false)
        setFullScreenControls(styles.controls)
        document.exitFullscreen();
      } else {
        setFullscreen(true)
        setFullScreenControls(styles.fullScreenControls)
        playerContainer.requestFullscreen();
      }
    }
  };



  return (
    <>
      <div
        id="playerContainer"
        style={{ position: "relative", height: "min-content" }}
        className={styles.playerContainer}
      >
        <ReactPlayer
          id="player"
          pip={pipMode}
          className={styles.player}
          playing={playing}
          controls={false}
          url={videoUrl}
          muted={false}
          volume={volume}
          height={"min-content"}
          width="100%"
          ref={videoRef}
        />
        <div className={fullScreenControls}>
          <div className={styles.controlsSideContainer}>
            {playing ? <FaPause onClick={() => setPlaying(!playing)} /> : <FaPlay onClick={() => setPlaying(!playing)} />}
            <div style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
              <FaVolumeDown onClick={() => volume == 0 ? setVolume(0.5) : setVolume(0)} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                onChange={(e) => setVolume(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.controlsSideContainer}>
              <Menu
                label={<IoMdSettings style={{color:'#fff'}} />}
                open={open}
                setOpen={setOpen}
                animate={open ? "open" : "closed"}
                initial="closed"
                exit="closed"
                variants={menu}
                style={{gap:'0.5rem'}}
              >
                {videoUrl == native ? (
                  <MenuItemSelected {...item}>1080p</MenuItemSelected>
                ) : (
                  <MenuItem {...item} onClick={() => handleChangeRes(1080)}>1080p</MenuItem>
                )}
                {videoUrl == hd ? (
                  <MenuItemSelected {...item}>720p</MenuItemSelected>
                ) : (
                  <MenuItem {...item} onClick={() => handleChangeRes(720)}>720p</MenuItem>
                )}
                {videoUrl == sd ? (
                  <MenuItemSelected {...item}>480p</MenuItemSelected>
                ) : (
                  <MenuItem {...item} onClick={() => handleChangeRes(480)}>480p</MenuItem>
                )}
              </Menu>
              <BsPip style={{cursor:'pointer'}} onClick={() => setPipMode(!pipMode)} />
              {fullscreen ? <BiExitFullscreen style={{cursor:'pointer'}} onClick={() => handleFullScreen()} /> : <BiFullscreen style={{cursor:'pointer'}} onClick={() => handleFullScreen()} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default HLSPlayer;
