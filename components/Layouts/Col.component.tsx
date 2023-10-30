import React from 'react'

const Col = ({children}:any) => {
  return (
    <div style={{display:'flex', flexDirection:'column'}}>
        {children}
    </div>
  )
}

export default Col