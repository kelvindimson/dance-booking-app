import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { dbConnection } from "./db"
import { accounts, sessions, users, verificationTokens } from "./db/schema"
import Google from "next-auth/providers/google"
 
export const { handlers, auth } = NextAuth({
    adapter: DrizzleAdapter(dbConnection, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    }),
    providers: [Google],
})