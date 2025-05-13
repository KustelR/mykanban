import useIsMobile from "@/hooks/useisMobile";
import React, { ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import TextButton from "./TextButton";

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
      className="fixed left-0 top-0 size-full backdrop-blur-md"
    >
      <div className="flex flex-col space-y-5 w-full h-full md:place-items-center md: place-content-center">
        <div
          className="size-full md:size-fit overflow-y-scroll md:overflow-clip"
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsMouseDownOnItem(true);
          }}
        >
          {children}
        </div>
      </div>

      <button
        className="absolute bottom-5 right-5 w-10 h-10 bg-red-600 hover:bg-red-700 cursor-pointer rounded-full"
        onClick={() => {
          setIsActive(false);
        }}
      >
        X
      </button>
    </div>
  );
}

export function PopupPortal(props: {
  children: ReactNode;
  isEditing?: boolean;
  setIsEditing: (arg: boolean) => void;
}) {
  const { setIsEditing, isEditing, children } = props;
  return (
    <>
      {(isEditing == undefined || isEditing) &&
        createPortal(
          <Popup setIsActive={setIsEditing}>{children}</Popup>,
          document.body,
        )}
    </>
  );
}
