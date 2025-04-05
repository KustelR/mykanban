import Link from "next/link";
import React, { ReactNode } from "react";
import ThemeChanger from "./ThemeChanger";

export default function CustomHeader() {
  return (
    <header className="border-b-[1px] border-neutral-600 p-2">
      <ul className="flex space-x-5 w-full ">
        <li>
          <h1 className="text-2xl font-bold">MYKANBAN</h1>
        </li>
        <li className="flex items-end w-full">
          <ul className="flex space-x-2 content-end justify-between w-full">
            <NavItem>
              <Link href="/">Home</Link>
            </NavItem>
            <li>
              <ul className="flex space-x-4">
                <NavItem>
                  <Link href="/auth">Sign in / Sign up</Link>
                </NavItem>
                <NavItem>
                  <ThemeChanger></ThemeChanger>
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
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <li className="dark:hover:bg-white/10 p-1 rounded-md">{props.children}</li>
  );
}
