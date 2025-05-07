import { asc, eq } from "drizzle-orm";
import { dbConnection } from "@/db";
import { rooms, studios } from "@/db/schema";
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
    const roomId = searchParams.get("id");
    const studioId = searchParams.get("studioId");

    try {
        if (roomId) {
            const room = await dbConnection
                .select({
                    id: rooms.id,
                    studioId: rooms.studioId,
                    name: rooms.name,
                    description: rooms.description,
                    capacity: rooms.capacity,
                    amenities: rooms.amenities,
                    studioName: studios.name, // Include studio name
                })
                .from(rooms)
                .leftJoin(studios, eq(rooms.studioId, studios.id))
                .where(eq(rooms.id, roomId));

            if (room.length === 0) {
                return NextResponse.json({
                    message: "Room not found",
                    status: statusCodes.NOT_FOUND,
                    success: false
                });
            }

            return NextResponse.json({
                message: "Room fetched successfully",
                status: statusCodes.OK,
                success: true,
                data: room[0]
            });
        }

        // If studioId is provided, get rooms for that studio
        if (studioId) {
            const studioRooms = await dbConnection
                .select({
                    id: rooms.id,
                    studioId: rooms.studioId,
                    name: rooms.name,
                    description: rooms.description,
                    capacity: rooms.capacity,
                    amenities: rooms.amenities,
                    studioName: studios.name, // Include studio name
                })
                .from(rooms)
                .leftJoin(studios, eq(rooms.studioId, studios.id))
                .where(eq(rooms.studioId, studioId))
                .orderBy(asc(rooms.name));

            return NextResponse.json({
                message: "Rooms fetched successfully",
                status: statusCodes.OK,
                success: true,
                data: studioRooms
            });
        }

        // Get all rooms with studio names
        const allRooms = await dbConnection
            .select({
                id: rooms.id,
                studioId: rooms.studioId,
                name: rooms.name,
                description: rooms.description,
                capacity: rooms.capacity,
                amenities: rooms.amenities,
                studioName: studios.name, // Include studio name
            })
            .from(rooms)
            .leftJoin(studios, eq(rooms.studioId, studios.id))
            .orderBy(asc(rooms.name));

        return NextResponse.json({
            message: "Rooms fetched successfully",
            status: statusCodes.OK,
            success: true,
            data: allRooms
        });

    } catch (error) {
        console.error("Failed to fetch rooms:", error);
        return NextResponse.json({
            message: "Failed to fetch rooms",
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
            name,
            description,
            capacity,
            amenities,
        } = await req.json();

        if (!studioId || !name || !capacity) {
            return NextResponse.json({
                message: "Required fields missing",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        const currentDateTime = DateTime.utc().toJSDate();
        const newRoom = await dbConnection
            .insert(rooms)
            .values({
                id: uuidv4(),
                studioId,
                name,
                description,
                capacity,
                amenities,
                createdAt: currentDateTime
            })
            .returning();

        return NextResponse.json({
            message: "Room created successfully",
            status: statusCodes.CREATED,
            success: true,
            data: newRoom[0]
        });

    } catch (error) {
        console.error("Failed to create room:", error);
        return NextResponse.json({
            message: "Failed to create room",
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
            name,
            description,
            capacity,
            amenities,
        } = await req.json();

        if (!id) {
            return NextResponse.json({
                message: "Room ID is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        const currentDateTime = DateTime.utc().toJSDate();
        const updatedRoom = await dbConnection
            .update(rooms)
            .set({
                studioId,
                name,
                description,
                capacity,
                amenities,
                updatedAt: currentDateTime
            })
            .where(eq(rooms.id, id))
            .returning();

        return NextResponse.json({
            message: "Room updated successfully",
            status: statusCodes.OK,
            success: true,
            data: updatedRoom[0]
        });

    } catch (error) {
        console.error("Failed to update room:", error);
        return NextResponse.json({
            message: "Failed to update room",
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
                message: "Room ID is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        await dbConnection
            .delete(rooms)
            .where(eq(rooms.id, id));

        return NextResponse.json({
            message: "Room deleted successfully",
            status: statusCodes.OK,
            success: true
        });

    } catch (error) {
        console.error("Failed to delete room:", error);
        return NextResponse.json({
            message: "Failed to delete room",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}