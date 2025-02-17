"use client";

import { useState } from "react";
import TextInput from "@/shared/TextInput";
import { Card } from "./Card";
import TextButton from "@/shared/TextButton";
import { createPortal } from "react-dom";
import { nanoid } from "@reduxjs/toolkit";

export default function ColumnEditor(props: {
  defaultCol?: ColData;
  setColData: (arg: ColData) => void;
}) {
  let { defaultCol, setColData } = props;

  const [col, setCol] = useState(
    defaultCol ? defaultCol : { header: "", id: "fake", cards: [] },
  );
  const [title, setTitle] = useState("");
  return (
    <>
      <div className="w-full h-full  place-items-center place-content-center">
        <div
          className="w-fit bg-slate-100 dark:bg-neutral-900 border-[1px] border-neutral-400 dark:border-neutral-700 p-2 rounded-xl"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <section className="px-2">
              <header className="font-bold">Column editor</header>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setColData({ ...col, id: nanoid() });
                  if (e.nativeEvent.target) {
                    (e.nativeEvent.target as HTMLFormElement).reset();
                  }
                }}
              >
                <TextInput
                  onChange={(e) => {
                    setCol({ ...col, header: e.target.value });
                  }}
                  id="colCreator_setTitle"
                  label="Title"
                />
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
export function ColumnEditorPortal(props: {
  colData?: ColData;

  setColData: (arg: ColData) => void;
  setIsRedacting: (arg: boolean) => void;
}) {
  const { colData, setColData, setIsRedacting } = props;
  return createPortal(
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsRedacting(false);
      }}
      className="absolute left-0 top-0 w-full h-full"
    >
      <ColumnEditor defaultCol={colData} setColData={setColData}></ColumnEditor>
    </div>,
    document.body,
  );
}
