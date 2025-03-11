import React, { ReactNode, useState } from "react";
import ChangeIcon from "@public/change.svg";
import ArrowUpIcon from "@public/arrow-up.svg";
import ArrowDownIcon from "@public/arrow-down.svg";
import DeleteIcon from "@public/delete.svg";
import { moveCard, removeCard } from "@/scripts/kanban";
import ActionMenu from "../ui/ActionMenu";
import { CardEditorPortal } from "./editors/CardEditor";

type CardActionsProps = {
  children?: ReactNode;
  blocked?: boolean;
  cardData: CardData;
  columns: ColData[];
  setColumns: (arg: ColData[]) => void;
  cards?: Array<CardData>;
  setCards?: (arg: Array<CardData>) => void;
};

export default function CardActions(props: CardActionsProps) {
  const { children, blocked, cardData, columns, setColumns, cards, setCards } =
    props;

  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  return (
    <>
      <div
        className="size-fit relative w-full"
        onMouseEnter={(e) => {
          setIsActive(true);
        }}
        onMouseLeave={(e) => {
          setIsActive(false);
        }}
      >
        {children}
        {!blocked &&
          isActive &&
          renderActionMenu(columns, cardData, setColumns, setIsEditing)}
      </div>
      {isEditing &&
        renderEditor(
          cardData,
          blocked,
          isEditing,
          setIsEditing,
          cards,
          setCards,
        )}
    </>
  );
}

function renderActionMenu(
  columns: Array<ColData>,
  cardData: CardData,
  setColumns: (arg: Array<ColData>) => void,
  setIsEditing: (arg: boolean) => void,
) {
  const options = [
    {
      icon: ArrowUpIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        setColumns(moveCard(columns, cardData.columnId, cardData.id, -1));
      },
    },
    {
      icon: ArrowDownIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        setColumns(moveCard(columns, cardData.columnId, cardData.id, 1));
      },
    },
    {
      icon: ChangeIcon,
      className: "bg-green-800 hover:bg-green-900",
      callback: () => {
        setIsEditing(true);
      },
    },
    {
      icon: DeleteIcon,
      className: "bg-red-800 hover:bg-red-900",
      callback: () => {
        setColumns(removeCard(cardData.id, cardData.columnId, columns));
      },
    },
  ];

  return <ActionMenu options={options} />;
}

function renderEditor(
  cardData: CardData,
  blocked: boolean | undefined,
  isRedacting: boolean,
  setIsRedacting: (arg: boolean) => void,
  cards: CardData[] | undefined,
  setCards: ((cards: CardData[]) => void) | undefined,
) {
  return (
    <CardEditorPortal
      cardData={cardData}
      setCardData={(card) => {
        if (cards && setCards) {
          const cardIdx = cards.findIndex((card2) => {
            return card2.id === card.id;
          });
          const newCards = [...cards];
          newCards[cardIdx] = card;
          setCards(newCards);
        } else {
          throw new Error("trying to change unknown card");
        }
      }}
      blocked={blocked}
      isRedacting={isRedacting}
      setIsRedacting={setIsRedacting}
    />
  );
}
