"use client";
import React from "react";
import { SheetContent } from "./ui/sheet";

type Props = {
  children: React.ReactNode;
  side: "left";
  className?: string;
};

const CustomSheetContent = ({ children, side, className }: Props) => {
  return (
    <SheetContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      side={side}
      className={className}
    >
      {children}
    </SheetContent>
  );
};

export default CustomSheetContent;
