'use client'
import React from 'react'
 
import { useRouter } from 'next/navigation'

const GoHomeToRedirect = () => {
    const router = useRouter()

    //redirect to home page after 3 seconds
    React.useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/')
        }, 3000)

        return () => clearTimeout(timer)
    }, [router])
  return (
    <div>
       Go, Seek and you shall find.
       <p>Redirecting you to the home page in 3 seconds...</p>
       <p>If you are not redirected, click <a onClick={() => router.push('/')}>here</a>.</p>
    </div>
  )
}

export default GoHomeToRedirect