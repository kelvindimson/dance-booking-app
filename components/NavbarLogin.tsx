"use client"
import React from 'react'
import { Button } from './ui/button'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

const NavbarLogin = () => {
    const { data: session } = useSession()
    const sessionUser = session?.user?.name
  return (
    <Button variant="secondary" className="flex items-center gap-2 cursor-pointer">
        {sessionUser ? (
            <div className="flex items-center gap-2">
                <Image src={session?.user?.image || ""} alt="User Avatar" 
                className="w-6 h-6 rounded-full" 
                width={24} height={24}
                />
                <span>{sessionUser}</span>
            </div>
        ) : (
            <span>Login</span>
        )}
    </Button>
  )
}

export default NavbarLogin