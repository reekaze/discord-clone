"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

type MediaRoomProps = {
  chatId: string;
  video: boolean;
  audio: boolean;
};

const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    return () => {};
  }, []);

  return <div>MediaRoom</div>;
};

export default MediaRoom;
