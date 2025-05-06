/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/studios/route.ts
import { and, asc, eq, isNull } from "drizzle-orm";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { statusCodes } from "@/constants/statusCodes";
import { dbConnection } from "@/db";
import { studios, rooms, users } from "@/db/schema";
import { slugify } from "@/utils/slugify";
// Helper function to check if handle exists
async function handleExists(handle: string, excludeId?: string) {
    const query = excludeId
        ? and(eq(studios.handle, handle), isNull(studios.deletedAt), eq(studios.id, excludeId))
        : and(eq(studios.handle, handle), isNull(studios.deletedAt));

    const existing = await dbConnection
        .select()
        .from(studios)
        .where(query);

    return existing.length > 0;
}

// GET - Fetch studio(s)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const studioId = searchParams.get("id");

        if (studioId) {
            // Fetch specific studio with its rooms
            const studio = await dbConnection
                .select()
                .from(studios)
                .where(
                    and(
                        eq(studios.id, studioId),
                        isNull(studios.deletedAt)
                    )
                );

            if (!studio.length) {
                return NextResponse.json({
                    message: "Studio not found",
                    status: statusCodes.NOT_FOUND,
                    success: false
                });
            }

            // Get studio's rooms
            const studioRooms = await dbConnection
                .select()
                .from(rooms)
                .where(
                    and(
                        eq(rooms.studioId, studioId),
                        isNull(rooms.deletedAt)
                    )
                );

            return NextResponse.json({
                message: "Studio found",
                status: statusCodes.OK,
                success: true,
                data: { ...studio[0], rooms: studioRooms }
            });
        }

        // Fetch all studios with their rooms
        const allStudios = await dbConnection
            .select()
            .from(studios)
            .where(isNull(studios.deletedAt))
            .orderBy(asc(studios.name));

        // Get rooms for all studios
        const studioRoomsMap = new Map();
        const allRooms = await dbConnection
            .select()
            .from(rooms)
            .where(isNull(rooms.deletedAt));

        allRooms.forEach(room => {
            if (!studioRoomsMap.has(room.studioId)) {
                studioRoomsMap.set(room.studioId, []);
            }
            studioRoomsMap.get(room.studioId).push(room);
        });

        const studiosWithRooms = allStudios.map(studio => ({
            ...studio,
            rooms: studioRoomsMap.get(studio.id) || []
        }));

        return NextResponse.json({
            message: "Studios found successfully",
            status: statusCodes.OK,
            success: true,
            data: studiosWithRooms
        });
    } catch (error) {
        console.error('Error fetching studios:', error);
        return NextResponse.json({
            message: "An error occurred while fetching studios",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}

// POST - Create a new studio
// POST - Create a new studio
export async function POST(req: NextRequest) {
    try {
        const {
            ownerId,
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

        // Validate required fields
        if (!name?.trim()) {
            return NextResponse.json({
                message: "Studio name is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        if (!ownerId) {
            return NextResponse.json({
                message: "Owner ID is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        if (!handle?.trim()) {
            return NextResponse.json({
                message: "Handle is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        if (!address?.trim() || !city?.trim() || !state?.trim() || !zipCode?.trim()) {
            return NextResponse.json({
                message: "Complete address is required (address, city, state, and ZIP code)",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        const trimmedHandle = handle.trim().toLowerCase();

        // Check if handle already exists
        const isHandleTaken = await handleExists(trimmedHandle);
        if (isHandleTaken) {
            return NextResponse.json({
                message: "This handle is already in use. Please choose a different one.",
                status: statusCodes.CONFLICT,
                success: false
            });
        }

        // Verify owner exists
        const owner = await dbConnection
            .select()
            .from(users)
            .where(eq(users.id, ownerId));

        if (!owner.length) {
            return NextResponse.json({
                message: "Invalid owner ID. The specified user does not exist.",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        const currentDateTime = DateTime.utc().toJSDate();
        const slug = slugify(name);

        const [newStudio] = await dbConnection.insert(studios).values({
            id: uuidv4(),
            ownerId,
            name: name.trim(),
            handle: trimmedHandle,
            description: description?.trim(),
            address: address?.trim(),
            city: city?.trim(),
            state: state?.trim(),
            zipCode: zipCode?.trim(),
            phone: phone?.trim(),
            email: email?.trim()?.toLowerCase(),
            website: website?.trim(),
            logo,
            slug,
            createdAt: currentDateTime
        }).returning();

        return NextResponse.json({
            message: "Studio created successfully",
            status: statusCodes.CREATED,
            success: true,
            data: newStudio
        });
    } catch (error) {
        console.error('Error creating studio:', error);
        
        // Handle specific database errors
        if (error instanceof Error) {
            if ('code' in error && error.code === '23503') { // Foreign key violation
                return NextResponse.json({
                    message: "Invalid owner ID. The specified user does not exist.",
                    status: statusCodes.BAD_REQUEST,
                    success: false
                });
            }
        }

        return NextResponse.json({
            message: "An unexpected error occurred while creating the studio. Please try again later.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}

// PATCH - Update studio
export async function PATCH(req: NextRequest) {
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

        // Check if studio exists
        const existingStudio = await dbConnection
            .select()
            .from(studios)
            .where(
                and(
                    eq(studios.id, id),
                    isNull(studios.deletedAt)
                )
            );

        if (!existingStudio.length) {
            return NextResponse.json({
                message: "Studio not found",
                status: statusCodes.NOT_FOUND,
                success: false
            });
        }

        // Check handle uniqueness if being updated
        if (handle && handle !== existingStudio[0].handle) {
            const trimmedHandle = handle.trim().toLowerCase();
            const doesHandleExists = await handleExists(trimmedHandle, id);
            if (doesHandleExists) {
                return NextResponse.json({
                    message: "Handle already exists",
                    status: statusCodes.CONFLICT,
                    success: false
                });
            }
        }

        const currentDateTime = DateTime.utc().toJSDate();
        const updateData: any = {
            updatedAt: currentDateTime
        };

        if (name) {
            updateData.name = name.trim();
            updateData.slug = slugify(name);
        }
        if (handle) updateData.handle = handle.trim().toLowerCase();
        if (description !== undefined) updateData.description = description?.trim();
        if (address !== undefined) updateData.address = address?.trim();
        if (city !== undefined) updateData.city = city?.trim();
        if (state !== undefined) updateData.state = state?.trim();
        if (zipCode !== undefined) updateData.zipCode = zipCode?.trim();
        if (phone !== undefined) updateData.phone = phone?.trim();
        if (email !== undefined) updateData.email = email?.trim()?.toLowerCase();
        if (website !== undefined) updateData.website = website?.trim();
        if (logo !== undefined) updateData.logo = logo;

        const [updatedStudio] = await dbConnection
            .update(studios)
            .set(updateData)
            .where(eq(studios.id, id))
            .returning();

        return NextResponse.json({
            message: "Studio updated successfully",
            status: statusCodes.OK,
            success: true,
            data: updatedStudio
        });
    } catch (error) {
        console.error('Error updating studio:', error);
        return NextResponse.json({
            message: "An error occurred while updating studio",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}

// DELETE - Soft delete studio
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const studioId = searchParams.get("id");

        if (!studioId) {
            return NextResponse.json({
                message: "Studio ID is required",
                status: statusCodes.BAD_REQUEST,
                success: false
            });
        }

        // Check if studio exists
        const existingStudio = await dbConnection
            .select()
            .from(studios)
            .where(
                and(
                    eq(studios.id, studioId),
                    isNull(studios.deletedAt)
                )
            );

        if (!existingStudio.length) {
            return NextResponse.json({
                message: "Studio not found",
                status: statusCodes.NOT_FOUND,
                success: false
            });
        }

        const currentDateTime = DateTime.utc().toJSDate();

        // Soft delete studio and its rooms
        await dbConnection.transaction(async (tx) => {
            // Soft delete rooms
            await tx
                .update(rooms)
                .set({
                    deletedAt: currentDateTime,
                    updatedAt: currentDateTime
                })
                .where(eq(rooms.studioId, studioId));

            // Soft delete studio
            await tx
                .update(studios)
                .set({
                    deletedAt: currentDateTime,
                    updatedAt: currentDateTime
                })
                .where(eq(studios.id, studioId));
        });

        return NextResponse.json({
            message: "Studio and related data deleted successfully",
            status: statusCodes.OK,
            success: true
        });
    } catch (error) {
        console.error('Error deleting studio:', error);
        return NextResponse.json({
            message: "An error occurred while deleting studio",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}