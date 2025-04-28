"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from "@/utils/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { signIn } from "next-auth/react"
import { GoogleSignIn } from "./GoogleSignIn"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(signInSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        // callbackUrl: "/account"  // Add this
      })

      console.log("Sign in result:", result) // Add this for debugging

      if (!result) {
        toast.error("An unexpected error occurred")
        return
      }

      if (result.error) {
        // Handle specific error messages from the server
        toast.error(`There was an error, ${result.error}`)
        return
      }
  
      if (!result.ok) {
        toast.error("Failed to sign in")
        return
      }

      toast.success("Signed in successfully!")
      // Redirect to the callback URL or a default page
      router.push(result.url || "/account")

      // if (!result?.ok) {
      //   // More detailed error handling
      //   if (result?.error) {
      //     toast.error(result.error)
      //   } else if (result?.status === 401) {
      //     toast.error("Invalid email or password")
      //   } else {
      //     toast.error("Failed to sign in")
      //   }
      //   return
      // }


      
      // // Use more reliable navigation
      // if (result.url) {
      //   window.location.href = result.url
      // } else {
      //   window.location.href = '/account'
      // }
    } catch (error) {
      console.error("Login error:", error) // Add this for debugging
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 text-center", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="py-6"
                    disabled={isLoading}
                    {...register("email")}
                  />
                  {errors.email && (
                    <span className="text-sm text-red-500">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="py-6"
                    disabled={isLoading}
                    {...register("password")}
                  />
                  {errors.password && (
                    <span className="text-sm text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full py-6 hover:cursor-pointer text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>

                </div>
              </div> 
            </form>

            <hr className="my-2" />
            <GoogleSignIn />

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
            
            <div className="mt-4 text-center text-sm">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline underline-offset-4"
              >
                Forgot your password? Get It Back.
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}