import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type props = {
  params: {
    channelId: string;
  };
};
export async function DELETE(
  req: NextRequest,
  { params: { channelId } }: props
) {
  try {
    const profile = await currentProfile();
    const serverId = req.nextUrl.searchParams.get("serverId");

    if (!profile) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return NextResponse.json("Server ID Missing", { status: 400 });
    }

    if (!channelId) {
      return NextResponse.json("Channel ID Missing", { status: 400 });
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
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params: { channelId } }: props
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const serverId = req.nextUrl.searchParams.get("serverId");

    if (!profile) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return NextResponse.json("Server ID Missing", { status: 400 });
    }

    if (!channelId) {
      return NextResponse.json("Channel ID Missing", { status: 400 });
    }

    if (name === "general") {
      return NextResponse.json("Name cannot be 'general'", { status: 400 });
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
          update: {
            where: {
              id: channelId,
              name: {
                not: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
