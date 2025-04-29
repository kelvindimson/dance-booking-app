import React from 'react'

import { auth } from '@/auth'
import { LoginForm } from '@/components/login-form'
import { GoogleSignOut } from '@/components/GoogleSignOut'


const LoginPage = async () => {
  const session = await auth()

  if (session) {
    // Redirect to the dashboard or home page
    return (
        <div>
            <h1>Welcome back, {session.user?.name}</h1>
            <p>You are already logged in.</p>
            <GoogleSignOut />
        </div>
    )
} else {

  return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    )
  }
  
}

export default LoginPage