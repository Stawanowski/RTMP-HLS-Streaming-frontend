import React from 'react'

const Row = ({children}:any) => {
  return (
    <div style={{display:'flex', flexDirection:'row'}}>
        {children}
    </div>
  )
}

export default Row