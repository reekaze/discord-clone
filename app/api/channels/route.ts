import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const serverId = req.nextUrl.searchParams.get("serverId");

    if (!profile) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return NextResponse.json("Server ID missing", { status: 400 });
    }

    if (name === "general") {
      return NextResponse.json("Name cannot be 'general", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("[CHANNELS_POST", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
