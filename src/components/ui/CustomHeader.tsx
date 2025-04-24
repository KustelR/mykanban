import Link from "next/link";
import React, { ReactNode } from "react";
import ThemeChanger from "./ThemeChanger";

export default function CustomHeader() {
  return (
    <header className="w-0 h-0 invisible sm:w-full sm:h-full sm:visible bg-blue-300 dark:bg-blue-900 p-2">
      <ul className="flex space-x-5 w-full items-end">
        <li>
          <h1 className="text-2xl font-bold">
            <span className="text-emerald-600 dark:text-red-500">MY</span>
            <span className="dark:text-orange-500">KANBAN</span>
          </h1>
        </li>
        <li className="flex items-end w-full">
          <ul className="flex space-x-2 items-end justify-between w-full">
            <NavItem>
              <Link href="/">Home</Link>
            </NavItem>
            <li>
              <ul className="space-x-4 items-end flex h-fit">
                <NavItem className="invisible size-0 md:visible md:size-fit">
                  <Link href="/auth">Sign in / Sign up</Link>
                </NavItem>
                <NavItem className="visible size-fit md:invisible md:size-0">
                  <Link href="/auth">Login</Link>
                </NavItem>
                <NavItem>
                  <ThemeChanger />
                </NavItem>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </header>
  );
}

function NavItem(props: {
  children?: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <li className={"cursor-pointer inline h-fit w-fit " + props.className}>
      {props.children}
    </li>
  );
}
