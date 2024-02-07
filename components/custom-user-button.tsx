"use client";
import React from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserProfile, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type CustomUserButtonProps = {
  imageUrl: string;
};

const CustomUserButton = ({ imageUrl }: CustomUserButtonProps) => {
  const { signOut } = useClerk();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative w-[48px] h-[48px] cursor-pointer hover:opacity-80 transition">
          <Image className="rounded-full" src={imageUrl} alt="image" fill />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        side="right"
        align="end"
      >
        <DropdownMenuItem
          onClick={() => {
            signOut(() => router.push("/"));
          }}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomUserButton;
