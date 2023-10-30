import React from 'react'

const Settings = ({user}:{user:User}) => {
  return (
    <div>
        <h1>{user.streamKey}</h1>
    </div>
  )
}

export default Settings