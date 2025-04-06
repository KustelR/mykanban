import Link from "next/link";
import React, { ReactNode } from "react";
import ThemeChanger from "./ThemeChanger";

export default function CustomHeader() {
  return (
    <header className="border-b-[1px] border-neutral-600 p-2">
      <ul className="flex space-x-5 w-full items-end">
        <li>
          <h1 className="text-2xl font-bold">MYKANBAN</h1>
        </li>
        <li className="flex items-end w-full">
          <ul className="flex space-x-2 items-end justify-between w-full">
            <NavItem>
              <Link href="/">Home</Link>
            </NavItem>
            <li>
              <ul className="space-x-4 items-end flex h-fit">
                <NavItem>
                  <Link href="/auth">Sign in / Sign up</Link>
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
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <li className="cursor-pointer inline h-fit w-fit">{props.children}</li>
  );
}
