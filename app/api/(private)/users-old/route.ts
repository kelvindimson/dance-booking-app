/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, asc, eq, isNull } from "drizzle-orm";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { v4 as uuidv4 } from 'uuid';
import { statusCodes } from "@/constants/statusCodes";
import { dbConnection } from "@/db";
import { users, userRoles as userRolesTable, roles } from "@/db/schema";
import { RolesTitle } from "@/models/authSchema";
import { getUserRoles } from "@/utils/getUserRoles";
import bcrypt from "bcryptjs";

// GET - Fetch users with their roles
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
    const userId = searchParams.get("id");

    try {
        if (userId) {
            // Get specific user with their roles
            const user = await dbConnection
                .select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    status: users.status,
                    phoneNumber: users.phoneNumber,
                    image: users.image,
                    createdAt: users.createdAt,
                    updatedAt: users.updatedAt
                })
                .from(users)
                .where(
                    and(
                        eq(users.id, userId),
                        isNull(users.deletedAt)
                    )
                );

            if (!user.length) {
                return NextResponse.json({
                    message: "User not found",
                    status: statusCodes.NOT_FOUND,
                    success: false
                });
            }

            // Get user's roles
            const userRoles: { roleId: string; roleName: string; }[] = await dbConnection
                .select({
                    roleId: roles.id,
                    roleName: roles.name
                })
                .from(roles)
                .innerJoin(userRolesTable, eq(userRolesTable.roleId, roles.id))
                .where(
                    and(
                        eq(userRolesTable.userId, userId),
                        isNull(userRolesTable.deletedAt),
                        isNull(roles.deletedAt)
                    )
                );

            return NextResponse.json({
                message: "User found",
                status: statusCodes.OK,
                success: true,
                data: { ...user[0], roles: userRoles }
            });
        }

        // Get all users with their roles
        const allUsers = await dbConnection
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                status: users.status,
                phoneNumber: users.phoneNumber,
                image: users.image,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt
            })
            .from(users)
            .where(isNull(users.deletedAt))
            .orderBy(asc(users.name));

        // Get roles for all users
        const userRolesMap = new Map();
        const allUserRoles = await dbConnection
            .select({
                userId: userRolesTable.userId,
                roleId: roles.id,
                roleName: roles.name
            })
            .from(roles)
            .innerJoin(userRolesTable, eq(userRolesTable.roleId, roles.id))
            .where(
                and(
                    isNull(userRolesTable.deletedAt),
                    isNull(roles.deletedAt)
                )
            );

        allUserRoles.forEach(ur => {
            if (!userRolesMap.has(ur.userId)) {
                userRolesMap.set(ur.userId, []);
            }
            userRolesMap.get(ur.userId).push({
                roleId: ur.roleId,
                roleName: ur.roleName
            });
        });

        const usersWithRoles = allUsers.map(user => ({
            ...user,
            roles: userRolesMap.get(user.id) || []
        }));

        return NextResponse.json({
            message: "Users found successfully",
            status: statusCodes.OK,
            success: true,
            data: usersWithRoles
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({
            message: "An error occurred while fetching users",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}

// POST - Create a new user
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

    try {
        const { email, name, password, phoneNumber, status, roleIds } = await req.json();

        if (!email?.trim() || !password?.trim()) {
            return NextResponse.json({
                message: "Email and password are required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        // Check if email already exists
        const existingUser = await dbConnection
            .select()
            .from(users)
            .where(
                and(
                    eq(users.email, email.trim().toLowerCase()),
                    isNull(users.deletedAt)
                )
            );

        if (existingUser.length > 0) {
            return NextResponse.json({
                message: "Email already exists",
                status: statusCodes.CONFLICT,
                success: false
            });
        }

        const currentDateTime = DateTime.utc().toJSDate();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const [newUser] = await dbConnection.insert(users).values({
            id: uuidv4(),
            email: email.trim().toLowerCase(),
            name: name?.trim(),
            password: hashedPassword,
            phoneNumber: phoneNumber?.trim(),
            status: status || 'pending',
            createdAt: currentDateTime
        }).returning();

        // Assign roles if provided
        if (roleIds && Array.isArray(roleIds) && roleIds.length > 0) {
            await dbConnection.insert(userRolesTable).values(
                roleIds.map(roleId => ({
                    userId: newUser.id,
                    roleId,
                    createdAt: currentDateTime
                }))
            );
        }

        // Get the created user with roles
        const userRolesData = await dbConnection
            .select({
                roleId: roles.id,
                roleName: roles.name
            })
            .from(roles)
            .innerJoin(userRolesTable, eq(userRolesTable.roleId, roles.id))
            .where(eq(userRolesTable.userId, newUser.id));

        const userData = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            phoneNumber: newUser.phoneNumber,
            status: newUser.status,
            roles: userRolesData
        };

        return NextResponse.json({
            message: "User created successfully",
            status: statusCodes.CREATED,
            success: true,
            data: userData
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({
            message: "An error occurred while creating user",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}

// PATCH - Update user
export async function PATCH(req: NextRequest) {
    if (req.method !== "PATCH") {
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
        const { id, email, name, password, phoneNumber, status, roleIds } = await req.json();
        const currentDateTime = DateTime.utc().toJSDate();

        if (!id) {
            return NextResponse.json({
                message: "User ID is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        // Check if user exists
        const existingUser = await dbConnection
            .select()
            .from(users)
            .where(
                and(
                    eq(users.id, id),
                    isNull(users.deletedAt)
                )
            );

        if (!existingUser.length) {
            return NextResponse.json({
                message: "User not found",
                status: statusCodes.NOT_FOUND,
                success: false
            });
        }

        // Check email uniqueness if email is being updated
        if (email && email !== existingUser[0].email) {
            const emailExists = await dbConnection
                .select()
                .from(users)
                .where(
                    and(
                        eq(users.email, email.trim().toLowerCase()),
                        isNull(users.deletedAt)
                    )
                );

            if (emailExists.length > 0) {
                return NextResponse.json({
                    message: "Email already exists",
                    status: statusCodes.CONFLICT,
                    success: false
                });
            }
        }

        const updateData: any = {
            updatedAt: currentDateTime
        };

        if (email) updateData.email = email.trim().toLowerCase();
        if (name !== undefined) updateData.name = name?.trim();
        if (password) updateData.password = await bcrypt.hash(password, 10);
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber?.trim();
        if (status) updateData.status = status;

        // Update user
        const [updatedUser] = await dbConnection
            .update(users)
            .set(updateData)
            .where(eq(users.id, id))
            .returning();

        // Update roles if provided
        if (roleIds && Array.isArray(roleIds)) {
            await dbConnection.transaction(async (tx) => {
                // Soft delete existing roles
                await tx
                    .update(userRolesTable)
                    .set({
                        deletedAt: currentDateTime,
                        updatedAt: currentDateTime
                    })
                    .where(eq(userRolesTable.userId, id));

                // Add new roles
                if (roleIds.length > 0) {
                    await tx.insert(userRolesTable).values(
                        roleIds.map(roleId => ({
                            userId: id,
                            roleId,
                            createdAt: currentDateTime
                        }))
                    );
                }
            });
        }

        // Get updated user with roles
        const updatedUserRoles = await dbConnection
            .select({
                roleId: roles.id,
                roleName: roles.name
            })
            .from(roles)
            .innerJoin(userRolesTable, eq(userRolesTable.roleId, roles.id))
            .where(
                and(
                    eq(userRolesTable.userId, id),
                    isNull(userRolesTable.deletedAt)
                )
            );

        const userData = {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            phoneNumber: updatedUser.phoneNumber,
            status: updatedUser.status,
            roles: updatedUserRoles
        };

        return NextResponse.json({
            message: "User updated successfully",
            status: statusCodes.OK,
            success: true,
            data: userData
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({
            message: "An error occurred while updating user",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}

// DELETE - Soft delete user
export async function DELETE(req: NextRequest) {
    if (req.method !== "DELETE") {
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
    const userId = searchParams.get("id");

    if (!userId) {
        return NextResponse.json({
            message: "User ID is required",
            status: statusCodes.BAD_REQUEST,
            success: false
        });
    }

    try {
        // Check if user exists
        const existingUser = await dbConnection
            .select()
            .from(users)
            .where(
                and(
                    eq(users.id, userId),
                    isNull(users.deletedAt)
                )
            );

        if (!existingUser.length) {
            return NextResponse.json({
                message: "User not found",
                status: statusCodes.NOT_FOUND,
                success: false
            });
        }

        const currentDateTime = DateTime.utc().toJSDate();

        // Soft delete user and their role assignments
        await dbConnection.transaction(async (tx) => {
            // Soft delete user roles
            await tx
                .update(userRolesTable)
                .set({
                    deletedAt: currentDateTime,
                    updatedAt: currentDateTime
                })
                .where(eq(userRolesTable.userId, userId));

            // Soft delete user
            await tx
                .update(users)
                .set({
                    deletedAt: currentDateTime,
                    updatedAt: currentDateTime,
                    status: 'deleted'
                })
                .where(eq(users.id, userId));
        });

        return NextResponse.json({
            message: "User deleted successfully",
            status: statusCodes.OK,
            success: true
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({
            message: "An error occurred while deleting user",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}