"use client";

import { useState } from "react";
import TextInput from "@/shared/TextInput";
import { Card } from "../Card";
import TextButton from "@/shared/TextButton";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import Popup from "@/shared/Popup";
import { requestToApi } from "@/scripts/project";
import CardView from "../CardView";
import TagEditor from "./TagEditor";
import { createTag, newTag } from "@/scripts/kanban";
import DeleteIcon from "@public/delete.svg";
import PlusIcon from "@public/plus.svg";

export default function CardEditor(props: {
  defaultCard?: CardData;
  setCardData: (arg: CardData) => void;
}) {
  let { defaultCard, setCardData } = props;

  const [card, setCard] = useState(defaultCard);
  const [newTagIds, setNewTagIds] = useState<string[]>([]);
  const [removingTagIds, setRemovingTagIds] = useState<string[]>([]);
  return (
    <>
      {card && (
        <div
          className="w-fit bg-slate-100 dark:bg-neutral-900 border-[1px] border-neutral-400 dark:border-neutral-700 p-2 rounded-xl"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            {cardDataEditor(
              card,
              setCard,
              (id) => {
                setNewTagIds(newTagIds.concat(id));
              },
              (id) => {
                setRemovingTagIds(removingTagIds.concat(id));
              },
            )}
            {preview(card)}
          </div>
          <TextButton
            className="w-full mt-2"
            onClick={(e) => {
              if (setCardData) setCardData(card);
              newTagIds.forEach((tagId) => {
                requestToApi(
                  "tags/link",
                  { cardId: card.id, tagId: tagId },
                  "put",
                );
              });
              removingTagIds.forEach((tagId) => {
                requestToApi(
                  "tags/unlink",
                  { cardId: card.id, tagId: tagId },
                  "delete",
                );
              });
            }}
          >
            ADD
          </TextButton>
        </div>
      )}
    </>
  );
}
export function CardEditorPortal(props: {
  cardData?: CardData;
  colId?: string;
  blocked?: boolean;
  isRedacting: boolean;
  setCardData: (arg: CardData) => void;
  setIsRedacting: (arg: boolean) => void;
}) {
  const { setIsRedacting, cardData, setCardData } = props;
  return createPortal(
    <Popup setIsActive={setIsRedacting}>
      <CardEditor defaultCard={cardData} setCardData={setCardData}></CardEditor>
    </Popup>,
    document.body,
  );
}

function preview(card: CardData) {
  return (
    <div className="max-w-96 space-y-2">
      <header className="font-bold">Preview</header>
      <h2>Card:</h2>
      <Card cardData={{ ...card }}></Card>
      <h2>Full:</h2>
      <CardView card={card} />
    </div>
  );
}

function cardDataEditor(
  card: CardData,
  setCard: (arg: CardData) => void,
  pushNewTagId: (arg: string) => void,
  removeTagId: (arg: string) => void,
) {
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const options = [
    {
      icon: DeleteIcon,
      className: "bg-red-800 hover:bg-red-900",
      condition: (tag: TagData) => {
        return card.tagIds.includes(tag.id);
      },
      callback: (tag: TagData) => {
        const data = card.tagIds.filter((t) => t !== tag.id);
        setCard({ ...card, tagIds: data });
        removeTagId(tag.id);
      },
    },
    {
      icon: PlusIcon,
      className: "bg-green-800 hover:bg-green-900",
      condition: (tag: TagData) => {
        return !card.tagIds.includes(tag.id);
      },
      callback: (tag: TagData) => {
        setCard({ ...card, tagIds: card.tagIds.concat(tag.id) });
        pushNewTagId(tag.id);
      },
    },
  ];

  return (
    <div className="md:border-r-[1px] px-2 md:border-neutral-400 md:dark:border-neutral-700">
      <header className="font-bold">Editor</header>
      <form action="" onSubmit={(e) => e.preventDefault()}>
        <TextInput
          defaultValue={card.name}
          onChange={(e) => {
            setCard({ ...card, name: e.target.value });
          }}
          id="cardCreator_name"
          label="Name"
        />
        <TextInput
          area
          defaultValue={card.description}
          onChange={(e) => {
            setCard({ ...card, description: e.target.value });
          }}
          id="cardCreator_description"
          label="Description"
        />
      </form>
      <TagEditor
        options={options}
        onTagCreation={async (name, color) => {
          const tags = store.getState().kanban.tags;
          const t = await createTag(
            tags ? tags : [],
            newTag(name, color),
            dispatch,
            store.getState().projectId,
          );
          setCard({ ...card, tagIds: card.tagIds.concat(t.id) });
          pushNewTagId(t.id);
        }}
      ></TagEditor>
    </div>
  );
}
