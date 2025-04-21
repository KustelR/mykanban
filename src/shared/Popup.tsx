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

  const isMobile = useIsMobile();

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
      <div className="flex flex-col space-y-5 w-full h-full md:place-items-center md: place-content-center overflow-auto">
        <div
          className="w-full h-full md:w-fit overflow-scroll"
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsMouseDownOnItem(true);
          }}
        >
          {children}
        </div>
        {isMobile && (
          <TextButton
            className="w-full bg-red-500/50 text-white"
            onClick={() => {
              setIsActive(false);
            }}
          >
            close popup
          </TextButton>
        )}
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
