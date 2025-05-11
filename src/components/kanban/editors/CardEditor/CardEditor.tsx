"use client";

import { useEffect, useState } from "react";
import TextButton from "@/shared/TextButton";
import { requestToApi } from "@/scripts/project";
import { Alert } from "@/shared/Alert";
import { CardDataEditor } from "./CardDataEditor";
import { CardPreview, CardViewPreview } from "./Previews";

type AlertType = "success" | "fail" | "warning";

export default function CardEditor(props: {
  defaultCard?: CardData;
  setCardData: ((arg: CardData) => void) | ((arg: CardData) => Promise<void>);
  setIsEditing: (arg: boolean) => void;
}) {
  let { defaultCard, setCardData, setIsEditing } = props;

  const [card, setCard] = useState(defaultCard ? defaultCard : newCard());
  const [newTagIds, setNewTagIds] = useState<string[]>([]);
  const [removingTagIds, setRemovingTagIds] = useState<string[]>([]);
  const [alert, setAlert] = useState<null | string>("no alert");
  const [alertType, setAlertType] = useState<AlertType | null>(null);

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
        <div className="h-fit w-full bg-[#CCCCCC] dark:bg-neutral-900 p-2 space-y-2 rounded-xl flex flex-col">
          <CardDataEditor
            card={card}
            setCard={setCard}
            pushTagId={(id) => {
              setNewTagIds(newTagIds.concat(id));
            }}
            removeTagId={(id) => {
              setRemovingTagIds(removingTagIds.concat(id));
            }}
          />
          <TextButton
            className="w-full mt-2"
            onClick={async (e) => {
              await onSubmit(
                defaultCard,
                card,
                setCardData,
                setAlertType,
                setAlert,
                newTagIds,
                removingTagIds,
                setIsEditing,
              );
            }}
          >
            ADD
          </TextButton>
        </div>
        {alert && alertType && <Alert type={alertType}>{alert}</Alert>}
        <CardPreview card={card} />
      </div>
      <div className="invisible md:visible">
        <CardViewPreview card={card} />
      </div>
    </div>
  );
}

async function onSubmit(
  defaultCard: CardData | undefined,
  card: CardData,
  setCardData: (arg: CardData) => void,
  setAlertType: (arg: AlertType | null) => void,
  setAlert: (arg: string) => void,
  newTagIds: string[],
  removingTagIds: string[],
  setIsEditing: (arg: boolean) => void,
) {
  let error: any;
  try {
    setCardData(card);
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
  newTagIds.forEach(async (tagId) => {
    requestToApi("tags/link", { cardId: card.id, tagId: tagId }, "put");
  });
  removingTagIds.forEach((tagId) => {
    requestToApi("tags/unlink", { cardId: card.id, tagId: tagId }, "delete");
  });
  if (!defaultCard)
    setTimeout(() => {
      setIsEditing(false);
    }, 100);
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
