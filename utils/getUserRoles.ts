import { eq, inArray } from 'drizzle-orm';

import { dbConnection } from '@/db';
import { roles,  userRoles} from "@/db/schema";
import { RolesTitle } from "@/models/authSchema";

export const getUserRoles = async (userId: string, 
    // userEmail: string
) => {

    const rolesIdFromDB = await dbConnection.select({
        roleId: userRoles.roleId,
    }).from(userRoles).where(eq(userRoles.userId, userId))

    if (rolesIdFromDB.length === 0) return [];

    const roleIds = rolesIdFromDB.map((role: { roleId: string; }) => role.roleId);
    const rolesFromDB = await dbConnection.select().from(roles).where(inArray(roles.id, roleIds));
    const roleTitles = rolesFromDB.map((role) => role.name) as RolesTitle[];
    return roleTitles
}