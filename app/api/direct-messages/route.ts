import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return NextResponse.json("Channel ID missing", { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              Profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              Profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json(
      {
        items: messages,
        nextCursor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
