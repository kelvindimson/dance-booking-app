import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { dbConnection } from "./db"
import { accounts, sessions, users, verificationTokens } from "./db/schema"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { ZodError } from "zod"
import { signInSchema } from "./utils/zod"
import { validateCredentials } from "./utils/authUtils"
import { eq } from "drizzle-orm"
import { UserStatus } from "./models/authSchema"

export const { handlers, auth } = NextAuth({
    adapter: DrizzleAdapter(dbConnection, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    }),
    // session: {
    //     strategy: "jwt",
    //     maxAge: 30 * 24 * 60 * 60, // 30 days
    //     updateAge: 24 * 60 * 60, // 24 hours
    // },
    providers: [
        Google({}),
        Credentials({
            credentials: {
              email: { label: "Email", type: "email" },
              password: { label: "Password", type: "password" }
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            async authorize(credentials, request) {
                try {
                  const { email, password } = await signInSchema.parseAsync(credentials)
                  
                  const result = await validateCredentials(email, password)

                  const statusFromDB = await dbConnection
                    .select()
                    .from(users)
                    .where(eq(users.email, email))
                    .limit(1)

                    if (statusFromDB.length === 0) {
                        return null
                    }

                    const userStatus = statusFromDB[0].status
                  
                  if (!result.success || !result.user?.id || !result.user?.email) {
                    // NextAuth expects null for failed auth
                    return null
                  }
            
                  return {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name ?? null,
                    image: result.user.image ?? null,
                    // emailVerified: null,
                    phoneNumber: null,
                    // phoneNumberVerified: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                    status: userStatus as UserStatus,
                  }
                } catch (error) {
                  if (error instanceof ZodError) {
                    console.log('Validation error:', error.errors)
                  }
                  console.error('Auth error:', error)
                  return null
                }
              }
        })
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        // async jwt({ token, user, account, profile, session }) { 
        //     console.log("account from JWT", account)
        //     console.log("user from JWT", user)
        //     console.log("token JWT", token)
        //     console.log("profile JWT", profile)
        //     console.log("session JWT", session)
            
        //     return {
        //         ...token
        //     }
        // },

        // async session({ session, token}) {

        //     if (session) {
        //         console.log("session from auth", session)
        //     }

        //     if (token) {
        //         console.log("token from auth", token)
        //     }


        // return {
        //     ...session,
        //     roles: roles 
        // }
        //   return session
        // }

        session({ session, user }) {
            //lets add user roles to the session lets create fake roles for for testing
            const roles = ["admin", "user"]

            // Clean up the session data
            return {
                ...session,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    status: user.status,
                },
                roles: roles, // or your test roles ["admin", "user"]
            }
        }

      }
})