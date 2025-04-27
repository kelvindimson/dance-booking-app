/* eslint-disable @typescript-eslint/no-unused-vars */
import { dbConnection } from '@/db'
import { users } from '@/db/schema'
import { AuthResult} from '@/global'
import bcryptjs from 'bcryptjs'
import { eq } from "drizzle-orm"
import type { User } from "next-auth"

export async function saltAndHashPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10)
    return bcryptjs.hash(password, salt)
}
export async function getUserFromDb(email: string): Promise<User | null> {
    try {
      const user = await dbConnection
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
  
      return user[0] || null
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

export async function validateCredentials(email: string, password: string): Promise<AuthResult> {
    try { 
      const user = await getUserFromDb(email) as User
      
      if (!user) {
        return {
          success: false,
          user: null,
          message: "No account found with this email",
          code: 'USER_NOT_FOUND'
        }
      }
  
      if (!user.password) {
        return {
          success: false,
          user: null,
          message: "This account uses Google to sign in",
          code: 'INVALID_CREDENTIALS'
        }
      }
  
      const isValidPassword = await bcryptjs.compare(password, user.password)
      
      if (!isValidPassword) {
        return {
          success: false,
          user: null,
          message: "Incorrect password",
          code: 'INVALID_PASSWORD'
        }
      }
  
      const { password: _, ...userWithoutPassword } = user
      return {
        success: true,
        user: userWithoutPassword,
        message: "Authentication successful",
        code: 'SUCCESS'
      }
    } catch (error) {
      console.error('Error validating credentials:', error)
      return {
        success: false,
        user: null,
        message: "An error occurred during authentication",
        code: 'INVALID_CREDENTIALS'
      }
    }
}