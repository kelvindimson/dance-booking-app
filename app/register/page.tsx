import { RegisterForm } from '@/components/register-form'
import React from 'react'

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}

export default SignUpPage