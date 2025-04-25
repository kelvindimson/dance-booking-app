    import { boolean, timestamp, pgTable, text, primaryKey, integer, pgEnum, decimal} from "drizzle-orm/pg-core"
    import type { AdapterAccountType } from "next-auth/adapters"
   
    export const userStatusEnum = pgEnum('user_status', [
        'pending', 'active', 'inactive', 'banned', 'suspended', 'deleted'
    ]);

    export const classStatusEnum = pgEnum('class_status', [
        'active', 'cancelled', 'completed', 'scheduled', 'postponed', 'deleted'
    ]);
      
    export const bookingStatusEnum = pgEnum('booking_status', [
        'pending', 'confirmed', 'cancelled', 'completed', 'no_show', 'refunded', 'deleted'
    ]);

    const createdAtTimestamp = timestamp("created_at", {withTimezone: true}).defaultNow().notNull();
    const updatedAtTimestamp = timestamp("updated_at", {withTimezone: true});
    const deletedAtTimestamp = timestamp("deleted_at", {withTimezone: true});

    // Permission and Role related tables
    export const permissions = pgTable("permission", {
        id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
        name: text("name").notNull().unique(),
        description: text("description"),
        category: text("category").notNull(), // e.g., 'user', 'studio', 'class', 'booking'
        action: text("action").notNull(), // e.g., 'create', 'read', 'update', 'delete'
        createdAt: createdAtTimestamp,
        updatedAt: updatedAtTimestamp,
        deletedAt: deletedAtTimestamp,
    });
    
    export const roles = pgTable("role", {
        id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
        name: text("name").notNull().unique(),
        description: text("description"),
        isSystem: boolean("is_system").default(false), // To mark default system roles
        createdAt: createdAtTimestamp,
        updatedAt: updatedAtTimestamp,
        deletedAt: deletedAtTimestamp,
    });
    
    export const rolePermissions = pgTable("role_permission", {
        id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
        roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
        permissionId: text("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
        createdAt: createdAtTimestamp,
        updatedAt: updatedAtTimestamp,
        deletedAt: deletedAtTimestamp,
    }, (table) => ([
        primaryKey({ columns: [table.roleId, table.permissionId] }),
    ]));
    
    export const userRoles = pgTable("user_role", {
        id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
        createdAt: createdAtTimestamp,
        updatedAt: updatedAtTimestamp,
        deletedAt: deletedAtTimestamp,
    }, (table) => ([
        primaryKey({ columns: [table.userId, table.roleId] }),
    ]));

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

    // Dance Studio related tables
    export const studios = pgTable("studio", {
        id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
        ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        handle: text("handle").notNull().unique(),
        description: text("description"),
        address: text("address").notNull(),
        city: text("city").notNull(),
        state: text("state").notNull(),
        zipCode: text("zip_code").notNull(),
        phone: text("phone"),
        email: text("email"),
        website: text("website"),
        logo: text("logo"),
        slug: text("slug").notNull().unique(),
        createdAt: createdAtTimestamp,
        updatedAt: updatedAtTimestamp,
        deletedAt: deletedAtTimestamp,
    });
  
    export const rooms = pgTable("room", {
        id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
        studioId: text("studio_id").notNull().references(() => studios.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        description: text("description"),
        capacity: integer("capacity").notNull(),
        amenities: text("amenities"),
        createdAt: createdAtTimestamp,
        updatedAt: updatedAtTimestamp,
        deletedAt: deletedAtTimestamp,
    });
  
    export const instructorProfiles = pgTable("instructor_profile", {
        id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        bio: text("bio"),
        specialties: text("specialties"),
        certifications: text("certifications"),
        hourlyRate: decimal("hourly_rate"),
        availability: text("availability"), // JSON string for complex availability
        createdAt: createdAtTimestamp,
        updatedAt: updatedAtTimestamp,
        deletedAt: deletedAtTimestamp,
    });
  
  export const studioInstructors = pgTable("studio_instructor", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    studioId: text("studio_id").notNull().references(() => studios.id, { onDelete: "cascade" }),
    instructorProfileId: text("instructor_profile_id").notNull().references(() => instructorProfiles.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("active"), // active, inactive, suspended
    startDate: timestamp("start_date", {withTimezone: true}).notNull(),
    endDate: timestamp("end_date", {withTimezone: true}),
    contractTerms: text("contract_terms"), // JSON string for contract details
    createdAt: createdAtTimestamp,
    updatedAt: updatedAtTimestamp,
    deletedAt: deletedAtTimestamp,
  });
  
  export const classes = pgTable("class", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    studioId: text("studio_id").notNull().references(() => studios.id, { onDelete: "cascade" }),
    roomId: text("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
    primaryInstructorId: text("primary_instructor_id").notNull().references(() => studioInstructors.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    type: text("type").notNull(),
    level: text("level"),
    capacity: integer("capacity").notNull(),
    price: decimal("price").notNull(),
    duration: integer("duration").notNull(), // in minutes
    startTime: timestamp("start_time", {withTimezone: true}).notNull(),
    endTime: timestamp("end_time", {withTimezone: true}).notNull(),
    recurring: boolean("recurring").default(false),
    recurrencePattern: text("recurrence_pattern"), // JSON string for complex patterns
    status: classStatusEnum("status").default("scheduled"),
    createdAt: createdAtTimestamp,
    updatedAt: updatedAtTimestamp,
    deletedAt: deletedAtTimestamp,
  });
  
  export const classAssistants = pgTable("class_assistant", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    classId: text("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
    assistantInstructorId: text("assistant_instructor_id").notNull().references(() => studioInstructors.id, { onDelete: "cascade" }),
    createdAt: createdAtTimestamp,
    updatedAt: updatedAtTimestamp,
    deletedAt: deletedAtTimestamp,
  });
  
  export const bookings = pgTable("booking", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    classId: text("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
    status: bookingStatusEnum("status").default("pending"),
    paymentStatus: text("payment_status").notNull(),
    paymentAmount: decimal("payment_amount").notNull(),
    paymentDate: timestamp("payment_date", {withTimezone: true}),
    notes: text("notes"),
    createdAt: createdAtTimestamp,
    updatedAt: updatedAtTimestamp,
    deletedAt: deletedAtTimestamp,
  });
  
  // For handling package/subscription based bookings
  export const classPackages = pgTable("class_package", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    studioId: text("studio_id").notNull().references(() => studios.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    numberOfClasses: integer("number_of_classes").notNull(),
    price: decimal("price").notNull(),
    validityPeriod: integer("validity_period").notNull(), // in days
    createdAt: createdAtTimestamp,
    updatedAt: updatedAtTimestamp,
    deletedAt: deletedAtTimestamp,
  });
  
  export const userPackages = pgTable("user_package", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    packageId: text("package_id").notNull().references(() => classPackages.id, { onDelete: "cascade" }),
    remainingClasses: integer("remaining_classes").notNull(),
    purchaseDate: timestamp("purchase_date", {withTimezone: true}).notNull(),
    expiryDate: timestamp("expiry_date", {withTimezone: true}).notNull(),
    createdAt: createdAtTimestamp,
    updatedAt: updatedAtTimestamp,
    deletedAt: deletedAtTimestamp,
  });