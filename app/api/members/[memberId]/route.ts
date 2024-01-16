import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

type props = {
  params: {
    memberId: string;
  };
};

export async function DELETE(
  req: NextRequest,
  { params: { memberId } }: props
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

    if (!memberId) {
      return NextResponse.json("Member ID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            Profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("[MEMBER_ID_DELETE]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params: { memberId } }: props) {
  try {
    const serverId = req.nextUrl.searchParams.get("serverId");
    const profile = await currentProfile();
    const { role } = await req.json();

    if (!profile) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return NextResponse.json("Server ID Missing", { status: 400 });
    }
    if (!memberId) {
      return NextResponse.json("Member ID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            Profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
