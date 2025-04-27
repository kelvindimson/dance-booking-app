"use client"
import { signIn } from "next-auth/react"
import { Button } from "./ui/button"
 
export function GoogleSignIn() {
  return (
    <Button onClick={() => signIn("google")} variant="outline" size={"lg"} className="w-full py-6 hover:cursor-pointer"> Login with Google </Button>
  )
}