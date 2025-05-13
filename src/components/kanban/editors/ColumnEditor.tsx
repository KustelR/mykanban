"use client";

import { useState } from "react";
import TextInput from "@/shared/TextInput";
import TextButton from "@/shared/TextButton";

export default function ColumnEditor(props: {
  defaultCol?: ColData;
  onSubmit: (name: string, id: string, cards: Array<CardData>) => void;
}) {
  let { defaultCol, onSubmit } = props;

  const [col, setCol] = useState(
    defaultCol ? defaultCol : { name: "", id: "fake", cards: [] },
  );
  return (
    <>
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
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(col.name, col.id, col.cards ? col.cards : []);
                if (e.nativeEvent.target) {
                  (e.nativeEvent.target as HTMLFormElement).reset();
                }
              }}
            >
              <TextInput
                onChange={(e) => {
                  setCol({ ...col, name: e.target.value });
                }}
                id="colCreator_setTitle"
                label="Title"
              />
              <TextButton className="w-full">SUBMIT</TextButton>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
