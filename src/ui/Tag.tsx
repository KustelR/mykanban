import React, { ReactNode } from "react";

export default function Tag(props: { children: ReactNode }) {
  return (
    <div className="max-w-[200px] truncate overflow-hidden text-nowrap text-ellipsis rounded-md bg-cyan-700/20 mr-1 mb-1 px-1 border-[1px] border-cyan-600/30">
      {props.children}
    </div>
  );
}
