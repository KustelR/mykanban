import React, { ReactNode } from "react";

export default function Popup(props: {
  children: ReactNode;
  setIsActive: (arg: boolean) => void;
}) {
  const { children, setIsActive } = props;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsActive(false);
      }}
      className="fixed left-0 top-0 w-full h-full"
    >
      {children}
    </div>
  );
}
