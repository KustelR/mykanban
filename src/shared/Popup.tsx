import React, { ReactNode, useState } from "react";
import { createPortal } from "react-dom";

export default function Popup(props: {
  children: ReactNode;
  setIsActive: (arg: boolean) => void;
}) {
  const [isMouseDownOnItem, setIsMouseDownOnItem] = useState(true);
  const { children, setIsActive } = props;
  return (
    <div
      onMouseDown={() => {
        setIsMouseDownOnItem(false);
      }}
      onMouseUp={(e) => {
        if (!isMouseDownOnItem) setIsActive(false);
      }}
      className="fixed left-0 top-0 w-full h-full"
    >
      <div className="flex w-full h-full place-items-center place-content-center">
        <div
          className="size-fit"
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsMouseDownOnItem(true);
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function PopupPortal(props: {
  children: ReactNode;
  setIsEditing: (arg: boolean) => void;
}) {
  const { setIsEditing, children } = props;
  return createPortal(
    <Popup setIsActive={setIsEditing}>{children}</Popup>,
    document.body,
  );
}
