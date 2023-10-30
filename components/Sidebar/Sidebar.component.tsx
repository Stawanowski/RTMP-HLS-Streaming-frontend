import React from 'react'
import Channels from '../Channels/Channels.component'
import styles from './Sidebar.module.css'
const Sidebar = () => {
  return (
    <div className={styles.container}>
        <Channels />
    </div>
  )
}

export default Sidebar