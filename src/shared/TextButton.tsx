import { MouseEvent as ReactMouseEvent, ReactNode } from "react";

type ButtonProps = {
  children: string;
  onClick?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function TextButton(props: ButtonProps) {
  const { children, onClick } = props;
  return (
    <button
      onClick={onClick}
      className="border-[1px] px-4 py-2 rounded-xl dark:border-neutral-700 dark:hover:bg-neutral-800"
    >
      {children}
    </button>
  );
}
