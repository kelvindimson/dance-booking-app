import { asc, eq } from "drizzle-orm";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"
import { v4 as uuidv4 } from 'uuid';

import { statusCodes } from "@/constants/statusCodes";
import { dbConnection } from "@/db";
import { roles, userRoles } from "@/db/schema";
import { RolesTitle } from "@/models/authSchema";
import { getUserRoles } from "@/utils/getUserRoles";
import { Role } from "@/global";

interface RoleUserInput {
  userId: string;
  roleId: string;
}

async function getRoleWithUsers(roleId: string) {
    const roleData = await dbConnection
        .select()
        .from(roles)
        .where(eq(roles.id, roleId));

    if (roleData.length === 0) return null;

    const users = await dbConnection
        .select({
            userId: userRoles.userId,
            roleId: userRoles.roleId
        })
        .from(userRoles)
        .where(eq(userRoles.roleId, roleId));

    return {
        ...roleData[0],
        users
    };
}

// Helper function to check if role exists
async function roleExists(name: string) {
    const existingRole = await dbConnection
        .select()
        .from(roles)
        .where(eq(roles.name, name));
    return existingRole.length > 0;
}

// POST - Create a new role with users
export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
      return NextResponse.json({
        message: "Method not allowed.",
        status: statusCodes.METHOD_NOT_ALLOWED,
        success: false
      });
    }
  
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({
        message: "Unauthorized",
        status: statusCodes.UNAUTHORIZED,
        success: false
      });
    }
  
    const userRolesList = await getUserRoles(session.user.id);
    const allowedRolesArray: RolesTitle[] = ["Administrator"];
    const isAllowed = userRolesList.some(role => allowedRolesArray.includes(role as RolesTitle));
  
    if (!isAllowed) {
      return NextResponse.json({
        message: "Unauthorized access. Administrator role required.",
        status: statusCodes.UNAUTHORIZED,
        success: false
      });
    }
  
    const currentDateTime = DateTime.utc().toJSDate();
  
    try {
      const { title, description, users: roleUsers } = await req.json();
      const trimmedName = title?.trim();

      if (!trimmedName) {
        return NextResponse.json({
          message: "Name is required",
          status: statusCodes.BAD_REQUEST,
          success: false
        });
      }

      // Check for duplicate name
      const nameExists = await roleExists(trimmedName);
      if (nameExists) {
        return NextResponse.json({
          message: `Role ${trimmedName} already exists`,
          status: statusCodes.CONFLICT,
          success: false
        });
      }
  
      // Create role
      const [newRole] = await dbConnection.insert(roles).values({
        id: uuidv4(),
        name: trimmedName,
        description: description?.trim(),
        isSystem: false,
        createdAt: currentDateTime
      }).returning();
  
      // Add users if provided
      if (roleUsers && Array.isArray(roleUsers)) {
        await dbConnection.insert(userRoles).values(
          roleUsers.map((user: RoleUserInput) => ({
            userId: user.userId,
            roleId: newRole.id,
            createdAt: currentDateTime
          }))
        );
      }
  
      const roleWithUsers = await getRoleWithUsers(newRole.id);
  
      return NextResponse.json({
        message: "Role and users created successfully",
        status: statusCodes.CREATED,
        success: true,
        data: roleWithUsers
      });
    } catch (error) {
      console.error('Error creating role:', error);
      return NextResponse.json({
        message: "An error occurred while creating role",
        status: statusCodes.INTERNAL_SERVER_ERROR,
        success: false
      });
    }
}

// GET - Fetch role(s) with users
export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
        return NextResponse.json({
            message: "Method not allowed.",
            status: statusCodes.METHOD_NOT_ALLOWED,
            success: false
        });
    }

    const session = await auth();
    
    if (!session?.user?.id) {
        return NextResponse.json({
            message: "Unauthorized",
            status: statusCodes.UNAUTHORIZED,
            success: false
        });
    }

    const userRolesList = await getUserRoles(session.user.id);
    const allowedRolesArray: RolesTitle[] = ["Administrator"];
    const isAllowed = userRolesList.some(role => allowedRolesArray.includes(role as RolesTitle));

    if (!isAllowed) {
        return NextResponse.json({
            message: "Unauthorized access. Administrator role required.",
            status: statusCodes.UNAUTHORIZED,
            success: false
        });
    }

    const { searchParams } = new URL(req.url);
    const roleId = searchParams.get("id");

    try {
        if (roleId) {
            const roleData = await getRoleWithUsers(roleId);
            if (!roleData) {
                return NextResponse.json({
                    message: "Role not found",
                    status: statusCodes.NOT_FOUND,
                    success: false
                });
            }
            return NextResponse.json({
                message: "Role found",
                status: statusCodes.OK,
                success: true,
                data: roleData
            });
        }

        // Get all roles with their users
        const allRoles = await dbConnection.select().from(roles).orderBy(asc(roles.name));
        const rolesWithUsers = await Promise.all(
            allRoles.map(r => getRoleWithUsers(r.id))
        );

        return NextResponse.json({
            message: "Roles found successfully",
            status: statusCodes.OK,
            success: true,
            data: rolesWithUsers
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return NextResponse.json({
            message: "An error occurred while fetching roles",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}

// PATCH - Update role
export async function PATCH(req: NextRequest) {
    if(req.method !== "PATCH") {
        return NextResponse.json({
            message: "Method not allowed.",
            status: statusCodes.METHOD_NOT_ALLOWED,
            success: false
        });
    }

    const session = await auth();
    
    if (!session?.user?.id) {
        return NextResponse.json({
            message: "Unauthorized",
            status: statusCodes.UNAUTHORIZED,
            success: false
        });
    }

    const userRolesList = await getUserRoles(session.user.id);
    const allowedRolesArray: RolesTitle[] = ["Administrator"];
    const isAllowed = userRolesList.some(role => allowedRolesArray.includes(role as RolesTitle));

    if (!isAllowed) {
        return NextResponse.json({
            message: "Unauthorized access. Administrator role required.",
            status: statusCodes.UNAUTHORIZED,
            success: false
        });
    }

    try {
        const { id, title, description } = await req.json();
        const currentDateTime = DateTime.utc().toJSDate();

        if (!id) {
            return NextResponse.json({
                message: "Role ID is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        const trimmedName = title?.trim();

        // Check if role exists
        const existingRole = await dbConnection
            .select()
            .from(roles)
            .where(eq(roles.id, id));

        if (!existingRole.length) {
            return NextResponse.json({
                message: "Role not found",
                status: statusCodes.NOT_FOUND,
                success: false
            });
        }

        // If name is being updated, check for duplicates
        if (trimmedName && trimmedName !== existingRole[0].name) {
            const nameExists = await roleExists(trimmedName);
            if (nameExists) {
                return NextResponse.json({
                    message: `Role ${trimmedName} already exists`,
                    status: statusCodes.CONFLICT,
                    success: false
                });
            }
        }

        const updateData: Partial<Role> = {
            updatedAt: currentDateTime
        };

        if (trimmedName) updateData.name = trimmedName;
        if (description !== undefined) updateData.description = description.trim();

        const updatedRole = await dbConnection
            .update(roles)
            .set(updateData)
            .where(eq(roles.id, id))
            .returning();

        return NextResponse.json({
            message: "Role updated successfully",
            status: statusCodes.OK,
            success: true,
            data: updatedRole[0]
        });

    } catch (error) {
        console.error('Error updating role:', error);
        return NextResponse.json({
            message: "An error occurred while updating role",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}

// DELETE - Delete a role and its user assignments
export async function DELETE(req: NextRequest) {
    if(req.method !== "DELETE") {
        return NextResponse.json({
            message: "Method not allowed.",
            status: statusCodes.METHOD_NOT_ALLOWED,
            success: false
        });
    }

    const { searchParams } = new URL(req.url);
    const roleId = searchParams.get("id");

    if (!roleId) {
        return NextResponse.json({
            message: "Role ID is required",
            status: statusCodes.BAD_REQUEST,
            success: false
        });
    }

    const session = await auth();
    
    if (!session?.user?.id) {
        return NextResponse.json({
            message: "Unauthorized",
            status: statusCodes.UNAUTHORIZED,
            success: false
        });
    }

    const userRolesList = await getUserRoles(session.user.id);
    const allowedRolesArray: RolesTitle[] = ["Administrator"];
    const isAllowed = userRolesList.some(role => allowedRolesArray.includes(role as RolesTitle));

    if (!isAllowed) {
        return NextResponse.json({
            message: "Unauthorized access. Administrator role required.",
            status: statusCodes.UNAUTHORIZED,
            success: false
        });
    }

    try {
        // Check if role exists
        const existingRole = await dbConnection
            .select()
            .from(roles)
            .where(eq(roles.id, roleId));

        if (existingRole.length === 0) {
            return NextResponse.json({
                message: "Role not found",
                status: statusCodes.NOT_FOUND,
                success: false
            });
        }

        const currentDateTime = DateTime.utc().toJSDate();

        // Soft delete the role and its user assignments using a transaction
        await dbConnection.transaction(async (tx) => {
            // Soft delete user role assignments
            await tx
                .update(userRoles)
                .set({ 
                    deletedAt: currentDateTime,
                    updatedAt: currentDateTime 
                })
                .where(eq(userRoles.roleId, roleId));

            // Soft delete the role
            await tx
                .update(roles)
                .set({ 
                    deletedAt: currentDateTime,
                    updatedAt: currentDateTime 
                })
                .where(eq(roles.id, roleId));
        });

        return NextResponse.json({
            message: "Role and its assignments deleted successfully",
            status: statusCodes.OK,
            success: true
        });

    } catch (error) {
        console.error('Error deleting role:', error);
        return NextResponse.json({
            message: "An error occurred while deleting role",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}