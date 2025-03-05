"use client";
import React, { ReactNode, useState } from "react";

import { hexToRgb } from "@/shared/colors";
import { useAppStore } from "@/lib/hooks";

export default function Tag(props: { data: TagData }) {
  const { data } = props;
  const parsedColor = hexToRgb(data.color);
  return (
    <div
      style={{
        backgroundColor: `rgba(${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b}, .4)`,
        borderColor: data.color,
      }}
      className={`relative max-w-[200px] rounded-md  px-1 border-[1px]`}
    >
      <div className="truncate overflow-hidden text-nowrap text-ellipsis">
        {data.name}
      </div>
    </div>
  );
}
