"use client";

import { useEffect, useState } from "react";
import TextInput from "@/shared/TextInput";
import { Card } from "../Card";
import TextButton from "@/shared/TextButton";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import { requestToApi } from "@/scripts/project";
import CardView from "../CardView";
import TagEditor from "./TagEditor";
import { createTag, newTag } from "@/scripts/kanban";
import DeleteIcon from "@public/delete.svg";
import PlusIcon from "@public/plus.svg";
import { Alert } from "@/shared/Alert";
import useIsMobile from "@/hooks/useisMobile";

export default function CardEditor(props: {
  defaultCard?: CardData;
  setCardData: ((arg: CardData) => void) | ((arg: CardData) => Promise<void>);
  setIsEditing: (arg: boolean) => void;
}) {
  let { defaultCard, setCardData, setIsEditing } = props;

  const [card, setCard] = useState(defaultCard ? defaultCard : newCard());
  const [newTagIds, setNewTagIds] = useState<string[]>([]);
  const [removingTagIds, setRemovingTagIds] = useState<string[]>([]);
  const [alert, setAlert] = useState<null | string>("test");
  const [alertType, setAlertType] = useState<
    "success" | "fail" | "warning" | null
  >(null);

  useEffect(() => {
    if (
      card.description !== defaultCard?.description ||
      card.name != defaultCard.name ||
      card.tagIds.length != defaultCard?.tagIds.length
    ) {
      setAlertType("warning");
      setAlert("You have unsaved changes");
    } else {
      setAlertType(null);
    }
  }, [card]);

  return (
    <div
      className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex flex-col md:w-96">
        <div className="h-fit w-full bg-slate-100 dark:bg-neutral-900 p-2 space-y-2 rounded-xl flex flex-col">
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
          <TextButton
            className="w-full mt-2"
            onClick={async (e) => {
              let error: any;
              try {
                await setCardData(card);
              } catch (err) {
                error = err;
              } finally {
                setTimeout(() => {
                  setAlertType(null);
                }, 5000);
                if (!error) {
                  setAlertType("success");
                  setAlert("Card updated successfully");
                } else {
                  setAlertType("fail");
                  setAlert("Update failed, check console");
                  console.error(error);
                  return;
                }
              }
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
              if (!defaultCard)
                setTimeout(() => {
                  setIsEditing(false);
                }, 100);
            }}
          >
            ADD
          </TextButton>
        </div>
        {alert && alertType && <Alert type={alertType}>{alert}</Alert>}
        <CardPreview card={card} />
      </div>
      <div className="invisible md:visible">{preview(card)}</div>
    </div>
  );
}

function CardPreview(props: { card: CardData }) {
  const { card } = props;
  return (
    <div className="w-full">
      <Card cardData={{ ...card }}></Card>
    </div>
  );
}
function preview(card: CardData) {
  return (
    <div className="flex w-screen md:w-fit flex-col md:flex-row md:space-x-2 space-y-2">
      <div className="max-h-screen md:w-fit">
        <CardView card={card} />
      </div>
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
    <div className="max-w-full">
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
          const kanban = store.getState().kanban;
          const tags = kanban.tags;
          const t = await createTag(
            tags ? tags : [],
            newTag(name, color),
            dispatch,
            kanban.id,
          );
          setCard({ ...card, tagIds: card.tagIds.concat(t.id) });
          pushNewTagId(t.id);
        }}
      ></TagEditor>
    </div>
  );
}

export function newCard(): CardData {
  return {
    id: "",
    name: "",
    description: "",
    tagIds: [],
    order: -1,
    columnId: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    createdBy: "placeholder",
    updatedBy: "placeholder",
  };
}
