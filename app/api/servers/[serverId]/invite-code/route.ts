import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

type props = {
  params: {
    serverId: string;
  };
};
export async function PATCH(req: Request, { params: { serverId } }: props) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json("Unauthorized", {
        status: 401,
      });
    }

    if (!serverId) {
      return NextResponse.json("Server ID Missing", {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server, {
      status: 200,
    });
  } catch (error) {
    console.log("[SERVER_ID]", error);
    return NextResponse.json("Internal Error", {
      status: 500,
    });
  }
}
