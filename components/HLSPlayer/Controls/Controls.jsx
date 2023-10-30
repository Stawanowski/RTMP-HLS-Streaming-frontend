import React from "react";
import styles from "./Controls.module.css";
import { FaPlay, FaPause, FaVolumeDown } from "react-icons/fa";

const Controls = ({ isPlaying, onPlayPauseClick, onVolumeChange, volume }) => {
  return (
    <div className={styles.customControls}>
      <button onClick={onPlayPauseClick}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <div>
        <FaVolumeDown />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={onVolumeChange}
        />
      </div>
    </div>
  );
};

export default Controls;
