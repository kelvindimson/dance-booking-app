    import { boolean, timestamp, pgTable, text, primaryKey, integer, pgEnum} from "drizzle-orm/pg-core"
    import type { AdapterAccountType } from "next-auth/adapters"
   
    export const userStatusEnum = pgEnum('user_status', [
        'pending', 'active', 'inactive', 'banned', 'suspended', 'deleted'
    ]);

    const createdAtTimestamp = timestamp("created_at", {withTimezone: true}).defaultNow().notNull();
    const updatedAtTimestamp = timestamp("updated_at", {withTimezone: true});
    const deletedAtTimestamp = timestamp("deleted_at", {withTimezone: true});

    export const users = pgTable("user", {
        id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
        name: text("name"),
        email: text("email").unique(),
        emailVerified: timestamp("emailVerified", { mode: "date" }),
        image: text("image"),
        status: userStatusEnum("status").default("pending"),
        phoneNumber: text("phoneNumber"),
        phoneNumberVerified: timestamp("phoneNumberVerified", { mode: "date" }),
        createdAt: createdAtTimestamp,
        updatedAt: updatedAtTimestamp,
        deletedAt: deletedAtTimestamp,
    })
   
    export const accounts = pgTable(
      "account",{
        userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
      },
      (account) => [
        {
          compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
          }),
        },
      ]
    )
    
    export const sessions = pgTable("session", {
      sessionToken: text("sessionToken").primaryKey(),
      userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      expires: timestamp("expires", { mode: "date" }).notNull(),
    })
    
    export const verificationTokens = pgTable(
      "verificationToken",
      {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
      },
      (verificationToken) => [
        {
          compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
          }),
        },
      ]
    )
    
    export const authenticators = pgTable(
      "authenticator",
      {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
          .notNull()
          .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
      },
      (authenticator) => [
        {
          compositePK: primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
          }),
        },
      ]
    )