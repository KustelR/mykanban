"use client";

import { useState } from "react";
import TextInput from "@/shared/TextInput";
import { Card } from "./Card";
import TextButton from "@/shared/TextButton";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import { addCardByColIdAction } from "@/lib/features/kanban/kanbanSlice";

export default function CardEditor(props: { defaultCard?: CardData }) {
  let { defaultCard } = props;
  if (defaultCard === undefined) {
    defaultCard = {
      title: "",
      description: "",
      tags: [],
    };
  }
  const [card, setCard] = useState(defaultCard);
  const [tag, setTag] = useState("");
  useAppStore();
  const dispatch = useAppDispatch();
  return (
    <div className="w-full h-full  place-items-center place-content-center">
      <div
        className="w-fit bg-slate-100 dark:bg-neutral-900 border-[1px] border-neutral-400 dark:border-neutral-700 p-2 rounded-xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="border-r-[1px] px-2 border-neutral-400 dark:border-neutral-700">
            <header className="font-bold">Editor</header>
            <form action="">
              <TextInput
                defaultValue={card.title}
                onChange={(e) => {
                  setCard({ ...card, title: e.target.value });
                }}
                id="cardCreator_name"
                label="Name"
              />
              <TextInput
                area
                placeholder={card.description}
                onChange={(e) => {
                  setCard({ ...card, description: e.target.value });
                }}
                id="cardCreator_addDescription"
                label="Description"
              />
            </form>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (tag === "") return;
                setCard({ ...card, tags: card.tags.concat(tag) });
                setTag("");
                if (e.nativeEvent.target) {
                  (e.nativeEvent.target as HTMLFormElement).reset();
                }
              }}
            >
              <TextInput
                onChange={(e) => {
                  setTag(e.target.value);
                }}
                id="cardCreator_addTag"
                label="Add tag"
              />
            </form>
          </div>
          <div className="max-w-96">
            <header className="font-bold">Preview</header>
            <Card blocked cardData={card}></Card>
          </div>
        </div>
      </div>
      <TextButton
        onClick={(e) => {
          if (!card.colId) return;
          dispatch(addCardByColIdAction([card.colId, card]));
        }}
      >
        ADD
      </TextButton>
    </div>
  );
}
