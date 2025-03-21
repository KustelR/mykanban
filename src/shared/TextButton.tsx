"use client";

import { MouseEvent as ReactMouseEvent, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
};

export default function TextButton(props: ButtonProps) {
  const { children, onClick, className } = props;
  return (
    <button
      onClick={onClick}
      className={`border-[1px] px-4 py-2 rounded-xl bg-neutral-200 hover:bg-slate-300 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800 ${className}`}
    >
      {children}
    </button>
  );
}
