"use client"
import React, { useState } from 'react'
import styles from './Upload.module.css'
const UploadComponent = ({handlerFunction}:{handlerFunction:Function}) => {
    const [file, setFile] = useState<File>()

  return (
    <form className={styles.col} onSubmit={(e) => handlerFunction(e, file)}>
        <label htmlFor="file">Change profile picture: </label>
        <input
          type="file"
          name="file"
          id="file"
          required
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <button type="submit">Upload</button>
    </form>

  )
}

export default UploadComponent