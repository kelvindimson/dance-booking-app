import { asc, eq } from "drizzle-orm";
import { dbConnection } from "@/db";
import { studios } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { statusCodes } from "@/constants/statusCodes";
import { getUserRoles } from "@/utils/getUserRoles";
import { RolesTitle } from "@/models/authSchema";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from 'uuid';

async function checkHandleExists(handle: string) {
    const existing = await dbConnection
        .select()
        .from(studios)
        .where(eq(studios.handle, handle));
    return existing.length > 0;
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
    const studioId = searchParams.get("id");

    try {
        if (studioId) {
            const studio = await dbConnection
                .select()
                .from(studios)
                .where(eq(studios.id, studioId));

            if (studio.length === 0) {
                return NextResponse.json({
                    message: "Studio not found",
                    status: statusCodes.NOT_FOUND,
                    success: false
                });
            }

            return NextResponse.json({
                message: "Studio fetched successfully",
                status: statusCodes.OK,
                success: true,
                data: studio[0]
            });
        }

        const studiosList = await dbConnection
            .select()
            .from(studios)
            .orderBy(asc(studios.name));

        return NextResponse.json({
            message: "Studios fetched successfully",
            status: statusCodes.OK,
            success: true,
            data: studiosList
        });

    } catch (error) {
        console.error("Failed to fetch studios:", error);
        return NextResponse.json({
            message: "Failed to fetch studios",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
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
        const { 
            name, 
            handle,
            description,
            address,
            city,
            state,
            zipCode,
            phone,
            email,
            website,
            logo 
        } = await req.json();

        if (!name || !handle || !address || !city || !state || !zipCode) {
            return NextResponse.json({
                message: "Required fields missing",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        const isHandleTaken = await checkHandleExists(handle);
        if (isHandleTaken) {
            return NextResponse.json({
                message: `Handle ${handle} already exists`,
                status: statusCodes.CONFLICT,
                success: false
            });
        }

        const currentDateTime = DateTime.utc().toJSDate();
        const newStudio = await dbConnection
            .insert(studios)
            .values({
                id: uuidv4(),
                ownerId: session.user.id,
                name,
                handle,
                description,
                address,
                city,
                state,
                zipCode,
                phone,
                email,
                website,
                logo,
                slug: handle,
                createdAt: currentDateTime
            })
            .returning();

        return NextResponse.json({
            message: "Studio created successfully",
            status: statusCodes.CREATED,
            success: true,
            data: newStudio[0]
        });

    } catch (error) {
        console.error("Failed to create studio:", error);
        return NextResponse.json({
            message: "Failed to create studio",
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

    try {
        const { 
            id,
            name, 
            handle,
            description,
            address,
            city,
            state,
            zipCode,
            phone,
            email,
            website,
            logo 
        } = await req.json();

        if (!id) {
            return NextResponse.json({
                message: "Studio ID is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        // Verify ownership or admin status
        const studio = await dbConnection
            .select()
            .from(studios)
            .where(eq(studios.id, id));

        if (studio.length === 0) {
            return NextResponse.json({
                message: "Studio not found",
                status: statusCodes.NOT_FOUND,
                success: false
            });
        }

        const userRolesList = await getUserRoles(session.user.id);
        const isAdmin = userRolesList.includes("Administrator");
        const isOwner = studio[0].ownerId === session.user.id;

        if (!isAdmin && !isOwner) {
            return NextResponse.json({
                message: "Unauthorized access",
                status: statusCodes.UNAUTHORIZED,
                success: false
            });
        }

        if (handle && handle !== studio[0].handle) {
            const isHandleTaken = await checkHandleExists(handle);
            if (isHandleTaken) {
                return NextResponse.json({
                    message: `Handle ${handle} already exists`,
                    status: statusCodes.CONFLICT,
                    success: false
                });
            }
        }

        const currentDateTime = DateTime.utc().toJSDate();
        const updatedStudio = await dbConnection
            .update(studios)
            .set({
                name: name || undefined,
                handle: handle || undefined,
                description: description || undefined,
                address: address || undefined,
                city: city || undefined,
                state: state || undefined,
                zipCode: zipCode || undefined,
                phone: phone || undefined,
                email: email || undefined,
                website: website || undefined,
                logo: logo || undefined,
                slug: handle || undefined,
                updatedAt: currentDateTime
            })
            .where(eq(studios.id, id))
            .returning();

        return NextResponse.json({
            message: "Studio updated successfully",
            status: statusCodes.OK,
            success: true,
            data: updatedStudio[0]
        });

    } catch (error) {
        console.error("Failed to update studio:", error);
        return NextResponse.json({
            message: "Failed to update studio",
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

    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({
                message: "Studio ID is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        // Verify ownership or admin status
        const studio = await dbConnection
            .select()
            .from(studios)
            .where(eq(studios.id, id));

        if (studio.length === 0) {
            return NextResponse.json({
                message: "Studio not found",
                status: statusCodes.NOT_FOUND,
                success: false
            });
        }

        const userRolesList = await getUserRoles(session.user.id);
        const isAdmin = userRolesList.includes("Administrator");
        const isOwner = studio[0].ownerId === session.user.id;

        if (!isAdmin && !isOwner) {
            return NextResponse.json({
                message: "Unauthorized access",
                status: statusCodes.UNAUTHORIZED,
                success: false
            });
        }

        await dbConnection
            .delete(studios)
            .where(eq(studios.id, id));

        return NextResponse.json({
            message: "Studio deleted successfully",
            status: statusCodes.OK,
            success: true
        });

    } catch (error) {
        console.error("Failed to delete studio:", error);
        return NextResponse.json({
            message: "Failed to delete studio",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}