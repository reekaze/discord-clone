"use client";
import { Member } from "@prisma/client";
import React from "react";
import ChatWelcome from "./chat-welcome";

type Props = {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramkey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
};

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramkey,
  paramValue,
  type,
}: Props) => {
  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
    </div>
  );
};

export default ChatMessages;
