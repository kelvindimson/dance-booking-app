/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { v4 as uuid } from 'uuid'
import { encode as defaultEncode } from "next-auth/jwt"

const adapter = DrizzleAdapter(dbConnection)

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter,
    session: {
      strategy: "database",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        Google({}),
        Credentials({
            credentials: {
              email: { label: "Email", type: "email" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials, request) {
                try {
                    const { email, password } = await signInSchema.parseAsync(credentials)
                    const result = await validateCredentials(email, password)
                    
                    
                    if (!result.success || !result.user) {
                        // Log the *specific* reason server-side for debugging
                        console.error(`Authentication failed for ${email}: ${result.message}`);
            
                        // *** CHANGE HERE: Return null for expected auth failures ***
                        return null;
                        // throw new Error(result.message || "Authentication failed"); // <- Don't throw for expected failures
                    }

                    console.log(`Authentication successful for ${email}`);
                    console.log("User data:", result.user);
                    return result.user;
              
                //     // if (!result.user) {
                //     //   throw new Error("User not found")
                //     // }

                //   // Proper Drizzle ORM query
                //   const userFromDB = await dbConnection
                //     .select()
                //     .from(users)
                //     .where(eq(users.email, email))
                //     .limit(1)

                //   if (!userFromDB[0]) {
                //     throw new Error("User not found in database")
                //   }

                //   return userFromDB[0]

                } catch (error) {
                    console.error("Auth error:", error)
                    throw error
                }
            }
        })
    ],
    callbacks: {
        async session({ session, user }) {
            return {
                ...session,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    status: user.status,
                },
                roles: ["admin", "user"]
            }
        },
        async jwt({ token, user, account }) {
            if (account?.provider === "credentials") {
              token.credentials = true
            }
            return token
        },
    },
    jwt: {
        encode: async function (params) {
            if(params.token?.credentials) {

                const sessionToken = uuid()

                if (!params.token.sub){
                    throw new Error("No user ID found in token")
                }

                const createSession = await adapter?.createSession?.({
                    sessionToken,
                    userId: params.token.sub,
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                })

                if (!createSession) {
                    throw new Error("Failed to create session")
                }

                return sessionToken

            }

            return defaultEncode(params)

        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    secret: process.env.AUTH_SECRET!,
    // debug: process.env.NODE_ENV === "development",
})