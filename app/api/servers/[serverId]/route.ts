import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type props = {
  params: {
    serverId: string;
  };
};

export async function PATCH(req: Request, { params: { serverId } }: props) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", Error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
