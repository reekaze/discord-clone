import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type props = {
  params: {
    serverId: string;
  };
};

export async function PATCH(req: NextRequest, { params: { serverId } }: props) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return NextResponse.json("Server ID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("[SERVER_ID_LEAVE]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
