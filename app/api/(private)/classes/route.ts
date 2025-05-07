import { asc, eq } from "drizzle-orm";
import { dbConnection } from "@/db";
import { classes, studios, rooms, 
    // studioInstructors 
} from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { statusCodes } from "@/constants/statusCodes";
import { getUserRoles } from "@/utils/getUserRoles";
import { RolesTitle } from "@/models/authSchema";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from 'uuid';

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
    const classId = searchParams.get("id");

    try {
        if (classId) {
            const classData = await dbConnection
                .select({
                    id: classes.id,
                    studioId: classes.studioId,
                    roomId: classes.roomId,
                    primaryInstructorId: classes.primaryInstructorId,
                    name: classes.name,
                    description: classes.description,
                    type: classes.type,
                    level: classes.level,
                    capacity: classes.capacity,
                    price: classes.price,
                    duration: classes.duration,
                    startTime: classes.startTime,
                    endTime: classes.endTime,
                    recurring: classes.recurring,
                    recurrencePattern: classes.recurrencePattern,
                    status: classes.status,
                    studioName: studios.name,
                    roomName: rooms.name,
                })
                .from(classes)
                .leftJoin(studios, eq(classes.studioId, studios.id))
                .leftJoin(rooms, eq(classes.roomId, rooms.id))
                .where(eq(classes.id, classId));

            if (classData.length === 0) {
                return NextResponse.json({
                    message: "Class not found",
                    status: statusCodes.NOT_FOUND,
                    success: false
                });
            }

            return NextResponse.json({
                message: "Class fetched successfully",
                status: statusCodes.OK,
                success: true,
                data: classData[0]
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

        const classesList = await dbConnection
            .select({
                id: classes.id,
                studioId: classes.studioId,
                name: classes.name,
                type: classes.type,
                level: classes.level,
                capacity: classes.capacity,
                price: classes.price,
                duration: classes.duration,
                startTime: classes.startTime,
                endTime: classes.endTime,
                status: classes.status,
                studioName: studios.name,
                roomName: rooms.name,
            })
            .from(classes)
            .leftJoin(studios, eq(classes.studioId, studios.id))
            .leftJoin(rooms, eq(classes.roomId, rooms.id))
            .orderBy(asc(classes.startTime));

        return NextResponse.json({
            message: "Classes fetched successfully",
            status: statusCodes.OK,
            success: true,
            data: classesList
        });

    } catch (error) {
        console.error("Failed to fetch classes:", error);
        return NextResponse.json({
            message: "Failed to fetch classes",
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
            studioId,
            roomId,
            primaryInstructorId,
            name,
            description,
            type,
            level,
            capacity,
            price,
            duration,
            startTime,
            endTime,
            recurring,
            recurrencePattern,
            status = "scheduled"
        } = await req.json();

        console.log("Received data:", {
            studioId,
            roomId,
            primaryInstructorId,
            name,
            description,
            type,
            level,
            capacity,
            price,
            duration,
            startTime,
            endTime,
            recurring,
            recurrencePattern,
            status
        });

        if (!studioId || !roomId || !primaryInstructorId || !name || !type || 
            !capacity || !price || !duration || !startTime || !endTime) {
            return NextResponse.json({
                message: "Required fields missing",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        const currentDateTime = DateTime.utc().toJSDate();
        const newClass = await dbConnection
            .insert(classes)
            .values({
                id: uuidv4(),
                studioId,
                roomId,
                primaryInstructorId,
                name,
                description,
                type,
                level,
                capacity,
                price,
                duration,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                recurring,
                recurrencePattern,
                status,
                createdAt: currentDateTime
            })
            .returning();

        return NextResponse.json({
            message: "Class created successfully",
            status: statusCodes.CREATED,
            success: true,
            data: newClass[0]
        });

    } catch (error) {
        console.error("Failed to create class:", error);
        return NextResponse.json({
            message: "Failed to create class",
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
        const { 
            id,
            studioId,
            roomId,
            primaryInstructorId,
            name,
            description,
            type,
            level,
            capacity,
            price,
            duration,
            startTime,
            endTime,
            recurring,
            recurrencePattern,
            status
        } = await req.json();

        if (!id) {
            return NextResponse.json({
                message: "Class ID is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        const currentDateTime = DateTime.utc().toJSDate();
        const updatedClass = await dbConnection
            .update(classes)
            .set({
                studioId,
                roomId,
                primaryInstructorId,
                name,
                description,
                type,
                level,
                capacity,
                price,
                duration,
                startTime: startTime ? new Date(startTime) : undefined,
                endTime: endTime ? new Date(endTime) : undefined,
                recurring,
                recurrencePattern,
                status,
                updatedAt: currentDateTime
            })
            .where(eq(classes.id, id))
            .returning();

        return NextResponse.json({
            message: "Class updated successfully",
            status: statusCodes.OK,
            success: true,
            data: updatedClass[0]
        });

    } catch (error) {
        console.error("Failed to update class:", error);
        return NextResponse.json({
            message: "Failed to update class",
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
                message: "Class ID is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        await dbConnection
            .delete(classes)
            .where(eq(classes.id, id));

        return NextResponse.json({
            message: "Class deleted successfully",
            status: statusCodes.OK,
            success: true
        });

    } catch (error) {
        console.error("Failed to delete class:", error);
        return NextResponse.json({
            message: "Failed to delete class",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}