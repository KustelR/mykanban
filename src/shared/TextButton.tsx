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
      className={`cursor-pointer px-4 py-2 rounded-xl bg-neutral-200 hover:bg-slate-300 dark:bg-neutral-800  dark:hover:bg-neutral-700 ${className}`}
    >
      {children}
    </button>
  );
}
