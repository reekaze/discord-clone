import { db } from "./db";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }

  return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    console.log("find conversation");

    return await db.conversation.findFirst({
      where: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            Profile: true,
          },
        },
        memberTwo: {
          include: {
            Profile: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    console.log("create conversation");
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            Profile: true,
          },
        },
        memberTwo: {
          include: {
            Profile: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};
