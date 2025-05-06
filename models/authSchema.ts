import { z } from 'zod';


export const UserStatusSchema = z.enum([
    'pending',
    'active',
    'inactive',
    'banned',
    'suspended',
    'deleted',
])

export type UserStatus = z.infer<typeof UserStatusSchema>
export const UserStatuses = UserStatusSchema.options

// roles schema
export const rolesTitleSchema = z.enum([
    "Administrator",
    "StudioAdmin",
    "Instructor",
    "Student",
    "Guest",
]);


export type RolesTitle = z.infer<typeof rolesTitleSchema>;