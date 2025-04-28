"use client"
import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
 
export function GoogleSignOut() {
  return <Button className="cursor-pointer"  onClick={() => signOut()}> Sign Out </Button>
}