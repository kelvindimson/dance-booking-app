/* eslint-disable @typescript-eslint/no-explicit-any */
import { asc, eq } from "drizzle-orm";
import { dbConnection } from "@/db";
import { users, userRoles, roles } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { statusCodes } from "@/constants/statusCodes";
import { getUserRoles } from "@/utils/getUserRoles";
import { RolesTitle } from "@/models/authSchema";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";

async function emailExists(email: string) {
    const existingUser = await dbConnection
        .select()
        .from(users)
        .where(eq(users.email, email));
    return existingUser.length > 0;
}

export async function POST(req: Request) {
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
        const { email, password, name, status = "pending", roleIds } = await req.json();

        if (!email || !password) {
            return NextResponse.json({
                message: "Email and password are required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        const emailInUse = await emailExists(email);
        if (emailInUse) {
            return NextResponse.json({
                message: `Email ${email} is already in use`,
                status: statusCodes.CONFLICT,
                success: false
            });
        }

        const currentDateTime = DateTime.utc().toJSDate();
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        await dbConnection.transaction(async (tx) => {
            // Create user
            await tx
                .insert(users)
                .values({
                    id: userId,
                    email,
                    password: hashedPassword,
                    name: name || null,
                    status,
                    createdAt: currentDateTime
                });

            // Add roles if provided
            if (roleIds && Array.isArray(roleIds) && roleIds.length > 0) {
                await tx
                    .insert(userRoles)
                    .values(
                        roleIds.map(roleId => ({
                            userId,
                            roleId,
                            createdAt: currentDateTime
                        }))
                    );
            }
        });

        // Fetch created user with roles
        const newUser = await dbConnection
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                status: users.status,
                roles: roles.name
            })
            .from(users)
            .leftJoin(userRoles, eq(users.id, userRoles.userId))
            .leftJoin(roles, eq(userRoles.roleId, roles.id))
            .where(eq(users.id, userId));

        const userWithRoles = {
            ...newUser[0],
            roles: newUser.map(u => u.roles).filter(Boolean)
        };

        return NextResponse.json({
            message: "User created successfully",
            status: statusCodes.CREATED,
            success: true,
            data: userWithRoles
        });

    } catch (error) {
        console.error("Failed to create user:", error);
        return NextResponse.json({
            message: "Failed to create user",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    try {
        if (userId) {
            const user = await dbConnection
                .select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    status: users.status,
                    roles: roles.name
                })
                .from(users)
                .leftJoin(userRoles, eq(users.id, userRoles.userId))
                .leftJoin(roles, eq(userRoles.roleId, roles.id))
                .where(eq(users.id, userId));

            if (user.length === 0) {
                return NextResponse.json({
                    message: "User not found",
                    status: statusCodes.NOT_FOUND,
                    success: false
                });
            }

            const userWithRoles = {
                ...user[0],
                roles: user.map(u => u.roles).filter(Boolean)
            };

            return NextResponse.json({
                message: "User fetched successfully",
                status: statusCodes.OK,
                success: true,
                data: userWithRoles
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

        const allUsers = await dbConnection
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                status: users.status,
                roles: roles.name
            })
            .from(users)
            .leftJoin(userRoles, eq(users.id, userRoles.userId))
            .leftJoin(roles, eq(userRoles.roleId, roles.id))
            .orderBy(asc(users.name));

        const usersWithRoles = allUsers.reduce((acc: any[], curr) => {
            const existingUser = acc.find(u => u.id === curr.id);
            if (existingUser) {
                if (curr.roles) {
                    existingUser.roles.push(curr.roles);
                }
            } else {
                acc.push({
                    ...curr,
                    roles: curr.roles ? [curr.roles] : []
                });
            }
            return acc;
        }, []);

        return NextResponse.json({
            message: "Users fetched successfully",
            status: statusCodes.OK,
            success: true,
            data: usersWithRoles
        });

    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({
            message: "Failed to fetch users",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}

export async function PATCH(req: Request) {
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
        const { id, email, name, status, roleIds } = await req.json();

        if (!id) {
            return NextResponse.json({
                message: "ID is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        if (email) {
            const emailInUse = await emailExists(email);
            if (emailInUse) {
                return NextResponse.json({
                    message: `Email ${email} is already in use`,
                    status: statusCodes.CONFLICT,
                    success: false
                });
            }
        }

        const currentDateTime = DateTime.utc().toJSDate();

        await dbConnection.transaction(async (tx) => {
            await tx
                .update(users)
                .set({
                    name: name || undefined,
                    email: email || undefined,
                    status: status || undefined,
                    updatedAt: currentDateTime
                })
                .where(eq(users.id, id));

            if (roleIds && Array.isArray(roleIds)) {
                await tx
                    .delete(userRoles)
                    .where(eq(userRoles.userId, id));

                if (roleIds.length > 0) {
                    await tx
                        .insert(userRoles)
                        .values(
                            roleIds.map(roleId => ({
                                userId: id,
                                roleId: roleId,
                                createdAt: currentDateTime
                            }))
                        );
                }
            }
        });

        const updatedUser = await dbConnection
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                status: users.status,
                roles: roles.name
            })
            .from(users)
            .leftJoin(userRoles, eq(users.id, userRoles.userId))
            .leftJoin(roles, eq(userRoles.roleId, roles.id))
            .where(eq(users.id, id));

        const userWithRoles = {
            ...updatedUser[0],
            roles: updatedUser.map(u => u.roles).filter(Boolean)
        };

        return NextResponse.json({
            message: "User updated successfully",
            status: statusCodes.OK,
            success: true,
            data: userWithRoles
        });

    } catch (error) {
        console.error("Failed to update user:", error);
        return NextResponse.json({
            message: "Failed to update user",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}

export async function DELETE(req: Request) {
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

    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({
                message: "ID is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        await dbConnection.transaction(async (tx) => {
            // Delete user roles first
            await tx
                .delete(userRoles)
                .where(eq(userRoles.userId, id));

            // Then delete the user
            await tx
                .delete(users)
                .where(eq(users.id, id));
        });

        return NextResponse.json({
            message: "User deleted successfully",
            status: statusCodes.OK,
            success: true
        });

    } catch (error) {
        console.error("Failed to delete user:", error);
        return NextResponse.json({
            message: "Failed to delete user",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}