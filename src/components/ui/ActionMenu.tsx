"use client";

import useIsMobile from "@/hooks/useisMobile";
import React, { ReactElement, ReactNode } from "react";

type ActionMenuProps = {
  options: Array<{
    icon: (props: {
      width: number;
      height: number;
      className: string;
    }) => ReactNode;
    callback: () => void;
    className?: string;
  }>;
};

export default function ActionMenu(props: ActionMenuProps) {
  const { options } = props;
  const isMobile = useIsMobile();
  return (
    <ul
      className={`overflow-visible flex absolute top-0 right-0 flex-row"`}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {options.map((option, idx) => {
        return (
          <li key={idx}>
            <button
              className={`h-10 w-10 md:h-5 md:w-5 mr-2 md:mr-0 flex flex-wrap content-center cursor-pointer justify-center ${option.className}`}
              onClick={() => {
                option.callback();
              }}
            >
              {
                <option.icon
                  width={isMobile ? 16 : 64}
                  height={isMobile ? 16 : 64}
                  className="*:stroke-white *:fill-transparent"
                />
              }
            </button>
          </li>
        );
      })}
    </ul>
  );
}
