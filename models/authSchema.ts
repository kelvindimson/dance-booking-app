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