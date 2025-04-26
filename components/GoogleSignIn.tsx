"use client"
import { signIn } from "next-auth/react"
import { Button } from "./ui/button"
 
export function GoogleSignIn() {
  return (
    <Button onClick={() => signIn("google")} variant="outline" className="w-full"> Login with Google </Button>
  )
}