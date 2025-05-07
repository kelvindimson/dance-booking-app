import { asc, eq } from "drizzle-orm";
import { dbConnection } from "@/db";
import { roles } from "@/db/schema";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { auth } from "@/auth"
import { statusCodes } from "@/constants/statusCodes";
import { getUserRoles } from "@/utils/getUserRoles";
import { RolesTitle } from "@/models/authSchema";
import { DateTime } from "luxon";

async function roleExists(name: string) {
    const existingRole = await dbConnection
        .select()
        .from(roles)
        .where(eq(roles.name, name));
    return existingRole.length > 0;
}

export async function POST(req: Request) {

    //reject if method is not POST
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

    const { name, description } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({
        message: "Name is required",
        status: statusCodes.BAD_REQUEST,
        success: false
      });
    }

      // Check for duplicate name
      const nameExists = await roleExists(name.trim());

      if (nameExists) {
        return NextResponse.json({
          message: `Role ${name} already exists`,
          status: statusCodes.CONFLICT,
          success: false
        });
      }

    //create new role payload
    const newRolePayload = {
        id: uuidv4(),
        name: name,
        description: description || null,
        isSystem: false,
        createdAt: currentDateTime,
    };

    //insert new role into database
    const newRole = await dbConnection.insert(roles).values(newRolePayload).returning()

    return NextResponse.json({
        message: "Role created successfully",
        status: statusCodes.CREATED,
        success: true,
        data: newRole[0]
    });

  } catch (error) {
    console.error("Failed to create role:", error);
    return NextResponse.json({
        message: "Failed to create role",
        status: statusCodes.INTERNAL_SERVER_ERROR,
        success: false
      });
    }
}

// Function to handle GET requests
export async function GET(req: Request) {

    //reject if method is not GET
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
    const roleId = searchParams.get("id");

    try {

        if (roleId) {

            const role = await dbConnection.select().from(roles).where(eq(roles.id, roleId));

            if (role.length === 0) {
                return NextResponse.json({
                    message: "Role not found",
                    status: statusCodes.NOT_FOUND,
                    success: false
                });
            }

            return NextResponse.json({
                message: "Role fetched successfully",
                status: statusCodes.OK,
                success: true,
                data: role[0]
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

        const rolesList = await dbConnection.select().from(roles).orderBy(asc(roles.name));

        return NextResponse.json({
            message: "Roles fetched successfully",
            status: statusCodes.OK,
            success: true,
            data: rolesList
        });

    } catch (error) {
        console.error("Failed to fetch roles:", error);
        return NextResponse.json({
            message: "Failed to fetch roles",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
          });
    }
}

//PATCH method
export async function PATCH(req: Request) {
    //reject if method is not PATCH
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

    const { id, name, description } = await req.json();

    if (!id || id.trim() === "") {
      return NextResponse.json({
        message: "ID is required",
        status: statusCodes.BAD_REQUEST,
        success: false
      });
    }

    if (!name || name.trim() === "") {
      return NextResponse.json({
        message: "Name is required",
        status: statusCodes.BAD_REQUEST,
        success: false
      });
    }

      // Check for duplicate name
      const nameExists = await roleExists(name.trim());

      if (nameExists) {
        return NextResponse.json({
          message: `Role ${name} already exists`,
          status: statusCodes.CONFLICT,
          success: false
        });
      }
    
    const currentDateTime = DateTime.utc().toJSDate();

    //create new role payload
    const updatedRolePayload = {
        name: name,
        description: description || null,
        updatedAt: currentDateTime,
    };

    //update role into database
    const updatedRole = await dbConnection.update(roles).set(updatedRolePayload).where(eq(roles.id, id)).returning()

    return NextResponse.json({
        message: "Role updated successfully",
        status: statusCodes.OK,
        success: true,
        data: updatedRole[0]
    });

  } catch (error) {
        console.error("Failed to update role:", error);
        return NextResponse.json({
            message: "Failed to update role",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
        });
    }
}

//DELETE method
export async function DELETE(req: Request) {
    //reject if method is not DELETE
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

    if (!id || id.trim() === "") {
      return NextResponse.json({
        message: "ID is required",
        status: statusCodes.BAD_REQUEST,
        success: false
      });
    }

    //delete role into database
    const deletedRole = await dbConnection.delete(roles).where(eq(roles.id, id)).returning()

    return NextResponse.json({
        message: "Role deleted successfully",
        status: statusCodes.OK,
        success: true,
        data: deletedRole[0]
    });

  } catch (error) {
        console.error("Failed to delete role:", error);
        return NextResponse.json({
            message: "Failed to delete role",
            status: statusCodes.INTERNAL_SERVER_ERROR,
            success: false
          });
    }
}