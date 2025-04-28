import { JwtPayload, sign, verify, SignOptions } from 'jsonwebtoken'
import { cache } from 'react'

interface CustomJwtPayload extends JwtPayload {
  email: string
  name?: string | null
  id: string
}

export const signJwtAccessToken = cache((payload: CustomJwtPayload, options: SignOptions = {}) => {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error("Missing secret for JWT validation")
  }

  const token = sign(payload, secret, {
    ...options,
    expiresIn: options.expiresIn || 30 * 24 * 60 * 60, // Default to 30 days
  })

  return {
    token,
    expiresIn: options.expiresIn
  }
})

export const validateJwtAccessToken = cache(async (token: string): Promise<CustomJwtPayload | null> => {
  try {
    const secret = process.env.AUTH_SECRET
    if (!secret) {
      throw new Error("Missing secret for JWT validation")
    }

    const decoded = verify(token, secret) as CustomJwtPayload
    return decoded
  } catch(error) {
    console.error("Token validation error:", error)
    return null
  }
})