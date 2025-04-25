"use client"
import React from 'react'
import { useParams } from 'next/navigation'

const HandleViewPage = () => {
  const { handle } = useParams()
  return (
    <div>
        <h1>Studio Details Page</h1>
        <p>This is wehere students can see the page of a studio</p>
        <p>Handle: {handle}</p> 
        {/* Add more details as needed */}
    </div>
  )
}

export default HandleViewPage